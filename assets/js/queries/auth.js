var isLogged = false;

function auth(data, callback) {
	$.ajax({
		type: "POST",
		data: data,
		dataType: "JSON",
		xhrFields: {
			withCredentials: true
		},
		url: server + "/" + path + "/auth.php",
		success: function(response) {
			callback(response);
			if (response.status_code === 0) {
                if ($(".anomaly-examples-type.active:visible").length) {
                    $(".anomaly-examples-type.active").click();
                } else {
                    $(".anomaly-class-item.active").click();
                }
			}
		}
	})
}

function check_auth(callback) {
	$.ajax({
		type: "POST",
		dataType: "JSON",
		url: server + "/" + path + "/auth.php",
		xhrFields: {
			withCredentials: true
		},
		success: function(response) {
			callback(response.status_code === 0, response.data);
		}
	});
}

function auth_info_show(email, code) {
	isLogged = true;
	$("#auth-info").html(
		'<div class="alert alert-success float-center" style="margin-bottom: 0;text-align: center;display: inline-block;"><b>' + email + '</b> (<a href="#" id="auth-logout">logout</a>). Your access code: <b>' + code + '</b></div>'
	);
}

function auth_confirm_form_show(email) {
	$("#auth-info").html(
		'<div class="input-group">' +
			'<input placeholder="Access code" id="auth-access-code" type="number" class="form-control" />' +
			'<input type="hidden" id="auth-email" value="' + email + '" />' +
			'<div class="input-group-btn">' +
				'<button type="button" class="btn btn-primary disabled" id="auth-access-code-confirm" style="border-radius: 0;">Confirm</button>' +
				'<button type="button" class="btn btn-default" id="auth-confirm-cancel" style="border-top-left-radius: 0;border-bottom-left-radius: 0;">Cancel</button>' +
			'</div>' +
		'</div>'
	);
	$("#auth-access-code").focus();
}

function auth_main_form_show() {
	$("#auth-info").html(
		'<div class="input-group">' +
			'<input type="email" placeholder="E-mail" id="auth-email" class="form-control" />' +
			'<div class="input-group-btn">' +
				'<button type="button" class="btn btn-primary disabled" id="auth-check" style="border-top-left-radius: 0;border-bottom-left-radius: 0;">Authorize</button>' +
			'</div>' +
		'</div>'
	);
}

function auth_logout() {
	$.ajax({
		type: "POST",
		dataType: "JSON",
		url: server + "/" + path + "/logout.php",
		xhrFields: {
			withCredentials: true
		},
		complete: function() {
			auth_main_form_show();
			isLogged = false;
			if ($(".anomaly-examples-type.active:visible").length) {
				$(".anomaly-examples-type.active").click();
            } else {
				$(".anomaly-class-item.active").click();
			}
		}
	});

	return false;
}