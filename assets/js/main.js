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
        loadAnomalyExamples(anomalyClasses[anomaliesClass], anomaliesClass, anomaliesType, function () {
            isLoadingExamples = false;
        });

        return false;
    });

    $(document.body).on("click", ".anomaly-example-spoiler", function(e) {
        var $this = $(this);

        if ($(e.target).hasClass("fa-star")) {
        	return;
		}

        var $anomalyExampleContent = $(this).parents(".anomaly-example-block").find(".anomaly-example-content");

        if (!$this.hasClass("collapsed")) {
            var filename = $this.data("filename");
            $anomalyExampleContent.html(anomalyExampleContents[filename]);
        } else {
            $anomalyExampleContent.empty();
        }
        $this.toggleClass("collapsed");
        $this.parent().next().toggle();
    });

    loadAnomalyClasses();

    $('head').append(
        $('<link rel="stylesheet" type="text/css" />')
            .attr('href', 'https://assets-cdn.github.com/assets/gist-embed-6b59eceda837.css')
    );

	check_auth(function(isLogged, data) {
	    if (isLogged) {
			auth_info_show(data.email, data.code);
        } else {
			auth_main_form_show();
        }
	});

	$(document.body).on("keyup", "#auth-email", function(e) {
	    if ($(this).val().length) {
			$("#auth-check").removeClass("disabled");
        } else {
			$("#auth-check").addClass("disabled");
        }

		if (e.keyCode === 13) {
			auth_check_handle($("#auth-check"));
		}
	});

	$(document.body).on("keyup", "#auth-access-code", function(e) {
	    if ($(this).val().length) {
			$("#auth-access-code-confirm").removeClass("disabled");
        } else {
			$("#auth-access-code-confirm").addClass("disabled");
        }

		if (e.keyCode === 13) {
			auth_check_handle($("#auth-access-code-confirm"));
		}
	});

	$(document.body).on("click", "#auth-check, #auth-access-code-confirm", function() {
		auth_check_handle($(this));
	});

	$(document.body).on("click", ".rating .fa-star", function() {
		var $this = $(this);
		var $parent = $this.parent(".rating");

		var voteValue = $this.data("value");
		var filename = $parent.data("filename");
		var gist = $parent.data("gist");
		var className = $parent.data("class");
		var typeName = $parent.data("type");

		vote($parent, voteValue, filename, gist, className, typeName);
	});

	$(document.body).on("click", "#auth-confirm-cancel", auth_main_form_show);

	$(document.body).on("click", "#auth-logout", auth_logout);
});

function auth_check_handle($button) {
	var email = $("#auth-email").val();
	var access_code = $("#auth-access-code").val();

	if ($button.hasClass("disabled")) {
		return false;
	}

	$button.html("Waiting...").addClass("disabled");
	auth({
		email: email,
		access_code: access_code
	}, function(response) {
		var status = response.status_code;

		if (status === 0) {
			auth_info_show(response.data.email, response.data.code);
		} else if (status === -3) {
			auth_confirm_form_show(email);
		} else {
			$button.html(access_code ? "Confirm" : "Authorize").removeClass("disabled");
		}
	});
}