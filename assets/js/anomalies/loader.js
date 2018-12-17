var anomalyExamplesPath = "./assets/data/anomaly_examples.json?v=0.5.7";

var anomalyClasses = {};
var anomalyExampleContents = {};

var mode = location.href.indexOf("mode=all") !== -1 ? 'all' : 'by_types';

function getAnomalyTotals(anomalyClassInfo) {
	if (mode === 'all') {
        return '<span class="badge badge-primary badge-pill float-right" style="margin-left: 5px;">' + anomalyClassInfo.examples.all.total + '</span>';
	} else {
        var cstAnomalies = anomalyClassInfo.examples.cst;
        var bytecodeAnomalies = anomalyClassInfo.examples.bytecode;
        var hwmAnomalies = anomalyClassInfo.examples.hwm;

        var cstAnomaliesHtml = cstAnomalies ?
            '<span class="badge badge-primary badge-pill float-right" style="margin-left: 5px;">' + cstAnomalies.total + '</span>' : '';
        var bytecodeAnomaliesHtml = bytecodeAnomalies ?
            '<span class="badge badge-info badge-pill float-right" style="margin-left: 5px;">' + bytecodeAnomalies.total + '</span>' : '';
        var hwmAnomaliesHtml = hwmAnomalies ?
            '<span class="badge badge-success badge-pill float-right" style="margin-left: 5px;">' + hwmAnomalies.total + '</span>' : '';

        return bytecodeAnomaliesHtml + cstAnomaliesHtml + hwmAnomaliesHtml;
	}
}

function showAnomalyTypes() {
	$("#anomaly-classes").prepend(
        mode === 'all' ? '' : (
            '<div style="padding: 10px 0 15px 0; text-align: center;border-left: 1px solid rgba(0,0,0,0.125);border-right: 1px solid rgba(0,0,0,0.125);">' +
				'<span class="badge badge-primary badge-pill" style="margin-left: 5px; display: inline-block;">PSI anomalies w/autoencoder</span>' +
				'<span class="badge badge-info badge-pill" style="margin-left: 5px; display: inline-block;">JVM-bytecode anomalies</span>' +
				'<span class="badge badge-success badge-pill" style="margin-left: 5px; display: inline-block;">PSI anomalies w/HWM</span>' +
			'</div>'
		)
	);
}

function anomaliesByTypesTransform(anomalyClasses) {
	if (mode !== 'all') {
		return anomalyClasses;
	}

	for (var anomalyClass in anomalyClasses) {
		var allAnomalies = {
			items: [],
            all_url: null,
			total: 0
		};
		if (anomalyClasses.hasOwnProperty(anomalyClass)) {
            var anomalyClassObject = anomalyClasses[anomalyClass];

            for (var example in anomalyClassObject.examples) {
                if (anomalyClassObject.examples.hasOwnProperty(example)) {
                    var exampleObject = anomalyClassObject.examples[example];
                    var items = anomalyClassObject.examples[example].items;

                    for (var item in items) {
                        if (anomalyClassObject.examples.hasOwnProperty(example)) {
                            items[item].type = example;
                        }
					}

                    allAnomalies.items = allAnomalies.items.concat(items);
                }
			}

            allAnomalies.total += allAnomalies.items.length;
            anomalyClasses[anomalyClass].examples = {
            	all: allAnomalies
			};
        }
	}

	return anomalyClasses;
}

function loadAnomalyClasses() {
    showAnomalyTypes();

	$.getJSON(anomalyExamplesPath, function(anomalyClassesLoaded) {
		anomalyClasses = anomaliesByTypesTransform(anomalyClassesLoaded);

		var anomalyClassesKeys = [];

		for (var k in anomalyClasses) {
			if (anomalyClasses.hasOwnProperty(k)) {
				anomalyClassesKeys.push(k);
			}
		}

		anomalyClassesKeys.sort();
		anomalyClassesKeys.forEach(function(anomalyClass) {
			var anomalyClassInfo = anomalyClasses[anomalyClass];

			$("#anomaly-classes").append(
				'<a href="#" id="' + anomalyClass + '" class="anomaly-class-item list-group-item list-group-item-action">' +
				'<span class="title">' + anomalyClassInfo.title + '</span>' + getAnomalyTotals(anomalyClassInfo) +
				'</a>'
			);
		});

		$("#anomaly-classes-loading").remove();
	});
}

function loadAnomalyExamples(anomalyClassInfo, anomalyClass, selectedAnomaliesType, callback) {
	var anomalyExamples = anomalyClassInfo.examples[selectedAnomaliesType];
	anomalyExampleContents = {};

    $(".class-rating").hide();
	$("#anomaly-examples-by-" + selectedAnomaliesType + "-title").text(anomalyClassInfo.title);
	$("#anomaly-examples-by-" + selectedAnomaliesType + "-all-url").attr("href", anomalyExamples.all_url);
	$("#anomaly-examples-by-" + selectedAnomaliesType + "-list").text("Loading examples...");

	var requestNumber = 0;
	var exampleNumber = 0;
	var anomalyExamplesHtml = [];
	var interceptedContent = '';
	document.write = function(str) {
		interceptedContent += str;
	};

	anomalyExamples.items.forEach(function (anomalyExample) {
		anomalyExamplesHtml.push([]);
		var anomalyExampleHtml = anomalyExamplesHtml[anomalyExamplesHtml.length - 1];
		var fileNumber = 0;

		var anomalyFilesKeys = [];

		for (var k in anomalyExample.files) {
			if (anomalyExample.files.hasOwnProperty(k)) {
				anomalyFilesKeys.push(k);
			}
		}

		anomalyFilesKeys.sort().reverse();
		anomalyFilesKeys.forEach(function(file) {
			requestNumber++;
			var githubGistUrl = anomalyExample.files[file];
			$.getScript(githubGistUrl + '.js', function(anomalyExampleHtml, file, fileNumber, exampleNumber, originalType) {
				return function () {
					requestNumber--;
					anomalyExampleHtml[fileNumber] = getAnomalyExampleFileBlock(
						exampleNumber + 1,
						file,
						githubGistUrl,
						anomalyClass,
						selectedAnomaliesType,
						originalType,
						interceptedContent,
                        anomalyExample.old
					);
					interceptedContent = '';

					if (requestNumber === 0) {
						showAnomalyExamples(selectedAnomaliesType, anomalyExamplesHtml);
						callback();
						loadVotes(anomalyClass, selectedAnomaliesType);
					}
				}
			}(anomalyExampleHtml, file, fileNumber, exampleNumber, anomalyExample.type));
			fileNumber++;
		});
		exampleNumber++;
	});
}