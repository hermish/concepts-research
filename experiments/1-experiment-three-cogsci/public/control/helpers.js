helpers = {
    MIDDLE: 24,
    HIGH_SCORES: 2405,
    LOW_SCORES: 24,
    STDEV: 10,
    GROUP_SIZE: 12,
    converter: new showdown.Converter()
};


helpers.createJudgmentTemplate = function (judgments) {
	var allIndicies = randomTools.range(judgments.questions.length),
		randomIndicies = jsPsych.randomization.shuffle(allIndicies),
		randomQuestions = randomIndicies.map(function (number) {
			return judgments.questions[number];
		}),
		randomChoices = randomIndicies.map(function (number) {
			return judgments.choices[number];
		});

	return {
		questions: randomQuestions,
		choices: randomChoices,
		indicies: randomIndicies
	};
};

helpers.assignScores = function (questionsAndAnswers) {
	var allIndicies = randomTools.range(questionsAndAnswers.questions.length),
		chosenIndicies = jsPsych.randomization.sample(
		    allIndicies, helpers.GROUP_SIZE, false
        ),
		chosenQuestions = chosenIndicies.map(function (number) {
			return questionsAndAnswers.questions[number];
		}),
		chosenAnswers = chosenIndicies.map(function (number) {
			return questionsAndAnswers.answers[number];
		}),
        randomScores = [];

	console.log(chosenIndicies);

	randomScores = randomScores.concat(
	    randomTools.getNormalRandom(
	        helpers.HIGH_SCORES,
            helpers.STDEV,
            helpers.GROUP_SIZE / 3
        ).map(Math.round),
        randomTools.getNormalRandom(
	        helpers.LOW_SCORES,
            helpers.STDEV,
            helpers.GROUP_SIZE / 3
        ).map(Math.round),
        new Array(helpers.GROUP_SIZE / 3).fill(null)
    );
	randomScores = jsPsych.randomization.shuffle(randomScores);

	return {
		indicies: chosenIndicies,
		questions: chosenQuestions,
		answers: chosenAnswers,
		scores: randomScores
	};
};

helpers.getJudgementBlockTimeline = function (questions, scores) {
    var text;
	return timeline = questions.map(function (question, pos) {
        text = helpers.formatQuestion(question, scores[pos]);
        return {preamble: helpers.converter.makeHtml(text)}
    });
};

helpers.formatQuestion = function (question, score) {
    var text = '### Question\n> **' + question + '**\n\n';
    if (score !== null) {
        text += '> **' + score.toString() + '** people upvoted this question';
    }
    text += '\n\n### Your Responses';
    return text;
};

// helpers.getChooseBlockQuestions = function (questions, scores) {
// 	var timeline = [],
// 		pos, text;
// 	for (pos = 0; pos < questions.length; pos++) {
// 		text = questions[pos] + ' [' + scores[pos].toString() +
// 			' people upvoted this question]';
// 		timeline.push(text);
// 	}
// 	return timeline;
// };
//
// helpers.fillDisplayBlockPages = function (data, questions, scores, answers) {
// 	var output = [],
// 		resp = JSON.parse(data.responses),
// 		pos, text;
// 	output.push('### Explanations');
// 	for (pos = 0; pos < data.responses.length; pos++) {
// 		if (resp['Q' + pos.toString()] === 'Reveal Answer') {
// 			text = '> **' + questions[pos] + '**\n\n> **' +
// 				scores[pos] +
// 				'** people upvoted this question\n\n' +
// 				answers[pos] + '\n\n\n';
// 			output.push(text);
// 		}
// 	}
// 	return [main.converter.makeHtml(output.join('\n'))];
// };

