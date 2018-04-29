var anomalyTypes = {
	cst: 1,
	bytecode: 2,
	hwm: 3
};

function getStars(filename, githubGistUrl, anomalyClass, originalType) {
	var fileExt = filename.split('.');
	fileExt = fileExt[fileExt.length - 1];

	var showCond = isLogged && (originalType !== "bytecode" || fileExt !== "kt");

	return showCond ? '<div style="float: right; position: relative; background: rgba(255,255,255,0.6);padding: 0 8px 0 5px;border-radius: 5px; z-index: 2;" class="rating" data-filename="' + filename + '" data-gist="' + githubGistUrl + '" data-class="' + anomalyClass + '" data-type="' + originalType + '">' +
		'<span class="fa fa-star" data-value="1"></span>' +
		'<span class="fa fa-star" data-value="2"></span>' +
		'<span class="fa fa-star" data-value="3"></span>' +
		'<span class="fa fa-star" data-value="4"></span>' +
		'<span class="fa fa-star" data-value="5"></span>' +
	'</div>' : '';
}

function getStarsForClass(anomalyClass) {
	return '<div style="float: right; position: relative; margin-top: 2px; background: rgba(255,255,255,0.6);padding: 0 8px 0 5px;margin-right: 10px;border-radius: 5px; z-index: 2;" class="class-rating" data-class="' + anomalyClass + '">' +
		'<span class="fa fa-star" data-value="1"></span>' +
		'<span class="fa fa-star" data-value="2"></span>' +
		'<span class="fa fa-star" data-value="3"></span>' +
		'<span class="fa fa-star" data-value="4"></span>' +
		'<span class="fa fa-star" data-value="5"></span>' +
	'</div>';
}

function vote_class($rating, vote, className) {
	$rating.find(".fa-star").fadeTo(300, 0.5);

	voteClassRequest({
		vote: vote,
		anomaly_class_name: className,
	}, function () {
		$rating.find(".fa-star:lt(" + vote + ")").addClass("checked");
		$rating.find(".fa-star:gt(" + (vote - 1) + ")").removeClass("checked");
		$rating.find(".fa-star").fadeTo(300, 1.0);
	}, 700);
}

function vote($rating, vote, filename, gist, className, typeName) {
	$rating.find(".fa-star").fadeTo(300, 0.5);

	voteRequest({
		vote: vote,
		anomaly_class_name: className,
		anomaly_type_id: anomalyTypes[typeName],
		anomaly_filename: filename,
		anomaly_gist_id: gist
	}, function () {
		$rating.find(".fa-star:lt(" + vote + ")").addClass("checked");
		$rating.find(".fa-star:gt(" + (vote - 1) + ")").removeClass("checked");
		$rating.find(".fa-star").fadeTo(300, 1.0);
	}, 700);
}

function loadVotes(className, typeName) {
	getVotesRequest({
		anomaly_class_name: className,
		anomaly_type_id: anomalyTypes[typeName]
	}, function (response) {
		if (!response.data) {
			return;
		}

		var votesAnomalies = response.data.anomalies;
		var classVote = response.data.class;

        if (!votesAnomalies) {
            return;
        }

        votesAnomalies.forEach(function (voteInfo) {
			var $rating = $(".anomaly-example-block[data-gist=\"" + voteInfo.gist_id + "\"] .rating");
			$rating.find(".fa-star:lt(" + voteInfo.vote + ")").addClass("checked");
			$rating.find(".fa-star:gt(" + (voteInfo.vote - 1) + ")").removeClass("checked");
		});

		if (classVote) {
			var $rating = $(".class-rating");
			$rating.find(".fa-star:lt(" + classVote.vote + ")").addClass("checked");
			$rating.find(".fa-star:gt(" + (classVote.vote - 1) + ")").removeClass("checked");
        }
        $(".class-rating").show();
	});
}