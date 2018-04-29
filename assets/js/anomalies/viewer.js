function selectAnomalyExamplesBlock(selectedAnomalyType) {
    var anomalyExampleTypeSelectorsMap = {
        'cst': {
            'block': '#anomaly-examples-by-cst',
            'tab': '#anomaly-examples-by-cst-tab'
        },
        'bytecode': {
            'block': '#anomaly-examples-by-bytecode',
            'tab': '#anomaly-examples-by-bytecode-tab'
        },
        'hwm': {
            'block': '#anomaly-examples-by-hwm',
            'tab': '#anomaly-examples-by-hwm-tab'
        },
        'all': {
            'block': '#anomaly-examples-all'
        }
    };

	if (mode === 'all') {
        $(anomalyExampleTypeSelectorsMap[selectedAnomalyType].block).addClass('show').show();
		return;
	}

	for (var anomalyType in anomalyExampleTypeSelectorsMap) {
		if (!anomalyExampleTypeSelectorsMap.hasOwnProperty(anomalyType)) {
			continue;
		}
		$(anomalyExampleTypeSelectorsMap[anomalyType].tab).removeClass('active');
		$(anomalyExampleTypeSelectorsMap[anomalyType].block).removeClass('show').hide();
	}

	$(anomalyExampleTypeSelectorsMap[selectedAnomalyType].tab).addClass('active');
	$(anomalyExampleTypeSelectorsMap[selectedAnomalyType].block).addClass('show').show();
}

function selectAndShowAnomalyExamplesBlock(cstExamples, bytecodeExamples, hwmExamples) {
	var anomalyExampleTypes = [];

	if (cstExamples) {
		$("#anomaly-examples-by-cst-number").text(cstExamples.total);
		$("#anomaly-examples-by-cst-tab").show();
		anomalyExampleTypes.push("cst");
	} else {
		$("#anomaly-examples-by-cst-tab").hide();
	}

	if (bytecodeExamples) {
		$("#anomaly-examples-by-bytecode-number").text(bytecodeExamples.total);
		$("#anomaly-examples-by-bytecode-tab").show();
		anomalyExampleTypes.push("bytecode");
	} else {
		$("#anomaly-examples-by-bytecode-tab").hide();
	}

	if (hwmExamples) {
		$("#anomaly-examples-by-hwm-number").text(hwmExamples.total);
		$("#anomaly-examples-by-hwm-tab").show();
		anomalyExampleTypes.push("hwm");
	} else {
		$("#anomaly-examples-by-hwm-tab").hide();
	}

	selectAnomalyExamplesBlock(anomalyExampleTypes[0]);

	return anomalyExampleTypes[0];
}

function getAnomalyExampleFileBlock(number, filename, githubGistUrl, anomalyClass, selectedAnomaliesType, originalType, content) {
	anomalyExampleContents[filename] = content;

	return (
		'<div class="panel panel-default anomaly-example-block" data-gist="' + githubGistUrl + '" style="margin-bottom: 24px;">' +
			'<div class="panel-heading">' +
				'<button type="button" data-filename="' + filename + '" style="background: #eee;border-bottom-left-radius: 0;border-bottom-right-radius: 0;display: block;width: 100%;text-align: left;" class="btn btn-default btn-xs anomaly-example-spoiler" data-toggle="collapse">' +
					getStars(filename, githubGistUrl, anomalyClass, originalType) +
					'Example ' + number + ': <b>' + filename + '</b>' +
				'</button>' +
			'</div>' +
			'<div class="panel-collapse collapse out">' +
				'<div class="panel-body anomaly-example-content"></div>' +
			'</div>' +
		'</div>'
	)
}

function showAnomalyExamples(selectedAnomaliesType, anomalyExamplesHtml) {
	var anomalyExampleListSelector = "#anomaly-examples-by-" + selectedAnomaliesType + "-list";

	$(anomalyExampleListSelector).empty();
	anomalyExamplesHtml.forEach(function(anomalyExampleHtml, index) {
		anomalyExampleHtml.forEach(function(anomalyExampleFileHtml) {
			$(anomalyExampleListSelector).append(anomalyExampleFileHtml);
		});
		if (index !== anomalyExamplesHtml.length - 1) {
			$(anomalyExampleListSelector).append("<hr />");
		}
	});
}

function showAnomalyExamplesBlock(anomalyClass, callback) {
    var anomalyClassInfo = anomalyClasses[anomalyClass];
    var activeAnomalyExamplesBlock;

    if (mode === 'all') {
    	selectAnomalyExamplesBlock('all');
        activeAnomalyExamplesBlock = 'all';
		$("#anomaly-examples > .nav-tabs").hide();
    } else {
		var cstExamples = anomalyClassInfo.examples.cst;
		var bytecodeExamples = anomalyClassInfo.examples.bytecode;
		var hwmExamples = anomalyClassInfo.examples.hwm;
		activeAnomalyExamplesBlock = selectAndShowAnomalyExamplesBlock(cstExamples, bytecodeExamples, hwmExamples);
    }

    if (isLogged) {
        $(".class-rating").remove();
        $(".all_url").after(getStarsForClass(anomalyClass));
    }

	loadAnomalyExamples(anomalyClassInfo, anomalyClass, activeAnomalyExamplesBlock, callback);
}