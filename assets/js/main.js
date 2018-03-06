$(document.body).on("click", ".spoiler-trigger", function() {
    $(this).parent().next().collapse('toggle');
});

var examplesMap = {};

$.getJSON("assets/data/anomaly_examples.json", function(examples) {
    examplesMap = examples;
});

var content = '';
document.write = function(s) {
    content += s;
};

function loadExamples(classInfo, source, sourceText, title) {
    if (classInfo.cstExamples) {
        $("#cst-examples").show()
        $("#cst-examples .total").text(classInfo.cstExamples.total);
    } else {
        $("#cst-examples").hide();
    }
    if (sourceText == "cst") {
        $(".source-examples").removeClass("active");
        $("#cst-examples").addClass("active");
        $(".anomalies-list").hide();
        $("#cst-anomalies").show().css("opacity", 1.0);
    }
    if (classInfo.bytecodeExamples) {
        $("#bytecode-examples").show()
        $("#bytecode-examples .total").text(classInfo.bytecodeExamples.total);
    } else {
        $("#bytecode-examples").hide();
    }
    if (sourceText == "bytecode") {
        $(".source-examples").removeClass("active");
        $("#bytecode-examples").addClass("active");
        $(".anomalies-list").hide();
        $("#bytecode-anomalies").show().css("opacity", 1.0);
    }
    var requested = 0;

    if (sourceText == "cst") {
        var contents = [];
        $("#anomaly_examples").html('Loading examples...');
        $("#all_examples_url").attr("href", source.all_url);
        $("#cst-class-title").text(title);
        var i = 1;
        for (var key in source.items) {
            var item = source.items[key];
            requested++;
            $.getScript('https://gist.github.com/PetukhovVictor/' + item + '.js', function(i, key, item) {
                return function() {
                    requested--;
                    contents[i - 1] = '<div class="panel panel-default" style="margin-bottom: 24px;"><div class="panel-heading"><button type="button" style="background: #eee;border-bottom-left-radius: 0;border-bottom-right-radius: 0;display: block;width: 100%;text-align: left;" class="btn btn-default btn-xs spoiler-trigger" data-toggle="collapse">Example ' + i + ': <b>' + key + '</b></button></div><div class="panel-collapse collapse out"><div class="panel-body">' + content + '</div></div></div>';

                    if (requested == 0) {
                        $("#anomaly_examples").empty();
                        contents.forEach(function(content) {
                            $("#anomaly_examples").append(content);
                        })
                    }
                    content = '';
                }
            }(i, key, item));
            i++;
        }
    } else if (sourceText == "bytecode") {
        var contents = [];
        $("#anomaly_examples_bytecode").html('Loading examples...');
        $("#all_examples_url_bytecode").attr("href", source.all_url);
        $("#bytecode-class-title").text(title);
        var i = 1;
        console.log(source.items);
        for (var key in source.items) {
            var item = source.items[key];
            contents[i - 1] = [];
            var j = 0;
            for (var partKey in item) {
                partItem = item[partKey];
                requested++;
                $.getScript('https://gist.github.com/PetukhovVictor/' + partItem + '.js', function(i, j, key, item) {
                    return function() {
                        requested--;
                        contents[i - 1][j] = '<div class="panel panel-default" style="margin-bottom: 24px;"><div class="panel-heading"><button type="button" style="background: #eee;border-bottom-left-radius: 0;border-bottom-right-radius: 0;display: block;width: 100%;text-align: left;" class="btn btn-default btn-xs spoiler-trigger" data-toggle="collapse">Example ' + i + ': <b>' + key + '</b></button></div><div class="panel-collapse collapse out"><div class="panel-body">' + content + '</div></div></div>';

                        if (requested == 0) {
                            $("#anomaly_examples_bytecode").empty();
                            contents.forEach(function(contentPart) {
                                contentPart.forEach(function(content) {
                                    $("#anomaly_examples_bytecode").append(content);
                                })
                                $("#anomaly_examples_bytecode").append("<hr />");
                            })
                        }
                        content = '';
                    }
                }(i, j, partKey, partItem));
                j++;
            }
            i++;
        }
    }
}

$("#anomaly-classes .list-group-item").on("click", function() {
    $(this).addClass("active");
    $("#anomaly-classes .list-group-item").removeClass("active");
    $(".anomalies-block").show();
    var classId = $(this).attr("id");
    var classInfo = examplesMap[classId];
    window.currentClassInfo = classInfo;
    window.currentClassTitle = $(this).find(".title").text()

    var source;
    var sourceText;

    if (classInfo.cstExamples) {
        source = classInfo.cstExamples;
        sourceText = "cst";
    } else if (classInfo.bytecodeExamples) {
        source = classInfo.bytecodeExamples;
        sourceText = "bytecode";
    }

    loadExamples(classInfo, source, sourceText, window.currentClassTitle);

    return false;
});

$(".source-examples").on("click", function() {
    var source;
    var sourceText;
    var id = $(this).attr("id");

    if (id == "cst-examples") {
        source = window.currentClassInfo.cstExamples;
        sourceText = "cst";
    } else if (id == "bytecode-examples") {
        source = window.currentClassInfo.bytecodeExamples;
        sourceText = "bytecode";
    }

    loadExamples(window.currentClassInfo, source, sourceText, window.currentClassTitle);

    return false;
});