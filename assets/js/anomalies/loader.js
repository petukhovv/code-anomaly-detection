var anomalyExamplesPath = "./assets/data/anomaly_examples.json?v=0.4.4";

var anomalyClasses = {};
var anomalyExampleContents = {};

function loadAnomalyClasses() {
	$.getJSON(anomalyExamplesPath, function(anomalyClassesLoaded) {
		anomalyClasses = anomalyClassesLoaded;

		var anomalyClassesKeys = [];

		for (var k in anomalyClasses) {
			if (anomalyClasses.hasOwnProperty(k)) {
				anomalyClassesKeys.push(k);
			}
		}

		anomalyClassesKeys.sort();
		anomalyClassesKeys.forEach(function(anomalyClass) {
			var anomalyClassInfo = anomalyClasses[anomalyClass];
			var cstAnomalies = anomalyClassInfo.examples.cst;
			var bytecodeAnomalies = anomalyClassInfo.examples.bytecode;
			var hwmAnomalies = anomalyClassInfo.examples.hwm;
			var cstAnomaliesHtml = cstAnomalies ?
				'<span class="badge badge-primary badge-pill float-right" style="margin-left: 5px;">' + cstAnomalies.total + '</span>' : '';
			var bytecodeAnomaliesHtml = bytecodeAnomalies ?
				'<span class="badge badge-info badge-pill float-right" style="margin-left: 5px;">' + bytecodeAnomalies.total + '</span>' : '';
			var hwmAnomaliesHtml = hwmAnomalies ?
				'<span class="badge badge-success badge-pill float-right" style="margin-left: 5px;">' + hwmAnomalies.total + '</span>' : '';

			$("#anomaly-classes").append(
				'<a href="#" id="' + anomalyClass + '" class="anomaly-class-item list-group-item list-group-item-action">' +
				'<span class="title">' + anomalyClassInfo.title + '</span>' + bytecodeAnomaliesHtml + cstAnomaliesHtml +
				hwmAnomaliesHtml +
				'</a>'
			);
		});

		$("#anomaly-classes-loading").remove();
	});
}

function loadAnomalyExamples(anomalyClassInfo, anomalyClass, selectedAnomaliesType, callback) {
	var anomalyExamples = anomalyClassInfo.examples[selectedAnomaliesType];
	anomalyExampleContents = {};

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
			$.getScript(githubGistUrl + '.js', function(anomalyExampleHtml, file, fileNumber, exampleNumber) {
				return function () {
					requestNumber--;
					anomalyExampleHtml[fileNumber] = getAnomalyExampleFileBlock(exampleNumber + 1, file, githubGistUrl, anomalyClass, selectedAnomaliesType, interceptedContent);
					interceptedContent = '';

					if (requestNumber === 0) {
						showAnomalyExamples(selectedAnomaliesType, anomalyExamplesHtml);
						callback();
						loadVotes(anomalyClass, selectedAnomaliesType);
					}
				}
			}(anomalyExampleHtml, file, fileNumber, exampleNumber));
			fileNumber++;
		});
		exampleNumber++;
	});
}