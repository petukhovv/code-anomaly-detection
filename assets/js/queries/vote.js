function voteRequest(data, callback) {
	$.ajax({
		type: "POST",
		data: data,
		dataType: "JSON",
		xhrFields: {
			withCredentials: true
		},
		url: server + "/" + path + "/vote.php",
		success: callback
	})
}

function votesRequest(data, callback) {
	$.ajax({
		type: "POST",
		data: data,
		dataType: "JSON",
		xhrFields: {
			withCredentials: true
		},
		url: server + "/" + path + "/get_votes.php",
		success: callback
	})
}