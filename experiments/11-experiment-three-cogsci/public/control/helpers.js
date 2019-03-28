helpers = {
  MIDDLE: 24,
  HIGH_SCORES: 2405,
  LOW_SCORES: 24,
  STDEV: 10,
  GROUP_SIZE: 12,
  converter: new showdown.Converter()
};

helpers.createJudgmentTemplate = function (judgments) {
  var allIndices = randomTools.range(judgments.questions.length),
    randomIndices = jsPsych.randomization.shuffle(allIndices),
    randomQuestions = randomIndices.map(function (number) {
      return judgments.questions[number];
    }),
    randomChoices = randomIndices.map(function (number) {
      return judgments.choices[number];
    });

  return {
    questions: randomQuestions,
    choices: randomChoices,
    indices: randomIndices
  };
};

helpers.assignScores = function (questionsAndAnswers) {
  var allIndices = randomTools.range(questionsAndAnswers.questions.length),
    chosenIndices = jsPsych.randomization.sample(
        allIndices, helpers.GROUP_SIZE, false
        ),
    chosenQuestions = chosenIndices.map(function (number) {
      return questionsAndAnswers.questions[number];
    }),
    chosenAnswers = chosenIndices.map(function (number) {
      return questionsAndAnswers.answers[number];
    }),
    randomScores = [];

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
    indices: chosenIndices,
    questions: chosenQuestions,
    answers: chosenAnswers,
    scores: randomScores
  };
};

helpers.getJudgementBlockTimeline = function (questions, scores) {
  return questions.map(function (question, pos) {
      var text;
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

