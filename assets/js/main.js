var anomalyClasses = {};
var anomalyExampleContents = {};

function loadAnomalyClasses() {
    $.getJSON("assets/data/anomaly_examples.json", function(anomalyClassesLoaded) {
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
            var cstAnomaliesHtml = cstAnomalies ?
                '<span class="badge badge-primary badge-pill float-right" style="margin-left: 5px;">' + cstAnomalies.total + '</span>' : '';
            var bytecodeAnomaliesHtml = bytecodeAnomalies ?
                '<span class="badge badge-info badge-pill float-right" style="margin-left: 5px;">' + bytecodeAnomalies.total + '</span>' : '';

            $("#anomaly-classes").append(
                '<a href="#" id="' + anomalyClass + '" class="anomaly-class-item list-group-item list-group-item-action">' +
                    '<span class="title">' + anomalyClassInfo.title + '</span>' + bytecodeAnomaliesHtml + cstAnomaliesHtml +
                '</a>'
            );
        })

        $("#anomaly-classes-loading").remove();
    });
}

function selectAnomalyExamplesBlock(selectedAnomalyType) {
    var anomalyExampleTypeSelectorsMap = {
        'cst': {
            'block': '#anomaly-examples-by-cst',
            'tab': '#anomaly-examples-by-cst-tab'
        },
        'bytecode': {
            'block': '#anomaly-examples-by-bytecode',
            'tab': '#anomaly-examples-by-bytecode-tab'
        }
    };

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

function selectAndShowAnomalyExamplesBlock(cstExamples, bytecodeExamples) {
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

    selectAnomalyExamplesBlock(anomalyExampleTypes[0]);

    return anomalyExampleTypes[0];
}

function getAnomalyExampleFileBlock(number, filename, content) {
    anomalyExampleContents[filename] = content;

    return (
        '<div class="panel panel-default anomaly-example-block" style="margin-bottom: 24px;">' +
            '<div class="panel-heading">' +
                '<button type="button" data-filename="' + filename + '" style="background: #eee;border-bottom-left-radius: 0;border-bottom-right-radius: 0;display: block;width: 100%;text-align: left;" class="btn btn-default btn-xs anomaly-example-spoiler" data-toggle="collapse">' +
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
    })
}

function loadAnomalyExamples(anomalyClassInfo, selectedAnomaliesType, callback) {
    var anomalyExamples = anomalyClassInfo.examples[selectedAnomaliesType];
    anomalyExampleContents = {}

    $("#anomaly-examples-by-" + selectedAnomaliesType + "-title").text(anomalyClassInfo.title);
    $("#anomaly-examples-by-" + selectedAnomaliesType + "-all-url").attr("href", anomalyExamples.all_url);
    $("#anomaly-examples-by-" + selectedAnomaliesType + "-list").text("Loading examples...");

    var githubProfileUrl = 'https://gist.github.com/PetukhovVictor';
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

        for (var file in anomalyExample.files) {
            if (!anomalyExample.files.hasOwnProperty(file)) {
                continue;
            }
            requestNumber++;
            var githubGistId = anomalyExample.files[file];
            $.getScript(githubProfileUrl + '/' + githubGistId + '.js', function(anomalyExampleHtml, file, fileNumber, exampleNumber) {
                return function () {
                    requestNumber--;
                    anomalyExampleHtml[fileNumber] = getAnomalyExampleFileBlock(exampleNumber + 1, file, interceptedContent);
                    interceptedContent = '';

                    if (requestNumber === 0) {
                        showAnomalyExamples(selectedAnomaliesType, anomalyExamplesHtml);
                        callback();
                    }
                }
            }(anomalyExampleHtml, file, fileNumber, exampleNumber));
            fileNumber++;
        }
        exampleNumber++;
    });
}

function showAnomalyExamplesBlock(anomalyClass, callback) {
    var anomalyClassInfo = anomalyClasses[anomalyClass];
    var cstExamples = anomalyClassInfo.examples.cst;
    var bytecodeExamples = anomalyClassInfo.examples.bytecode;
    var activeAnomalyExamplesBlock = selectAndShowAnomalyExamplesBlock(cstExamples, bytecodeExamples);

    loadAnomalyExamples(anomalyClassInfo, activeAnomalyExamplesBlock, callback);
}

$(document).ready(function() {
    var anomalyClassesSelector = "#anomaly-classes .anomaly-class-item";
    var anomalyExamplesSelector = "#anomaly-examples";
    var isLoadingExamples = false;

    $(document.body).on("click", anomalyClassesSelector, function() {
        if (isLoadingExamples) {
            return false;
        }
        var className = $(this).attr("id");

        isLoadingExamples = true;
        $(anomalyClassesSelector).removeClass("active");
        $(this).addClass("active");
        $(anomalyExamplesSelector).data("selectedClass", className);
        $(anomalyExamplesSelector).show();

        showAnomalyExamplesBlock(className, function () {
            isLoadingExamples = false;
        });

        $('html, body').animate({
            scrollTop: $(anomalyExamplesSelector).offset().top - 60
        }, 500);

        return false;
    });

    $(".anomaly-examples-type").on("click", function() {
        if (isLoadingExamples) {
            return false;
        }
        var anomaliesType = $(this).data("type");
        var anomaliesClass = $("#anomaly-examples").data("selectedClass");

        isLoadingExamples = true;
        selectAnomalyExamplesBlock(anomaliesType);
        loadAnomalyExamples(anomalyClasses[anomaliesClass], anomaliesType, function () {
            isLoadingExamples = false;
        });

        return false;
    });

    $(document.body).on("click", ".anomaly-example-spoiler", function() {
        if (!$(this).hasClass("collapsed")) {
            var filename = $(this).data("filename");
            $(this).parents(".anomaly-example-block").find(".anomaly-example-content").html(anomalyExampleContents[filename]);
        }
        $(this).toggleClass("collapsed");
        $(this).parent().next().collapse('toggle');
    });

    loadAnomalyClasses();
});
