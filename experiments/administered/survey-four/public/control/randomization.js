var randomization = {
	MIDDLE: 240,
	HIGH_SCORES: 2405,
	LOW_SCORES: 24,
	STDEV: 10,
	GROUP_SIZE: 10,

	getQuestionsAndAnswers: function(questionInformation) {
		var newQuestions = questionInformation.topics.map(function (topic) {
				return 'A question about ' + topic.toLowerCase() + '.';
			}),
			newAnswers = questionInformation.questions.map(function (question, index) {
				return question + '\n\n\n' + questionInformation.answers[index];
			});
		return {
			questions: newQuestions,
			answers: newAnswers
		};
	},

	createJudgmentTemplate: function(judgments) {
		/**
		@param judgments: {questions: [String], choices: [[String]]}
			an object which contains the series of participant judgments and 
			accompanying choices.

		@return: {questions: [String], choices: [[String]], indicies: [int]}
			an object which contains the series of judgements and choices in the
			indentical randomized order
		*/
		var allJudgments = judgments.questions,
			allChoices = judgments.choices,
			allIndicies = randomTools.range(allJudgments.length),

			randomIndicies = jsPsych.randomization.shuffle(allIndicies),
			randomQuestions = randomIndicies.map(function (number) {
				return allJudgments[number];
			}),
			randomChoices = randomIndicies.map(function (number) {
				return allChoices[number];
			})

		return {
			questions: randomQuestions,
			choices: randomChoices,
			indicies: randomIndicies
		};
	},

	assignScores: function(questionsAndAnswers) {
		var allQuestions = questionsAndAnswers.questions,
			allAnswers = questionsAndAnswers.answers,
			allIndicies = randomTools.range(allQuestions.length),

			chosenIndicies = jsPsych.randomization.sample(
				allIndicies, 
				randomization.GROUP_SIZE,
				false),
			chosenQuestions = chosenIndicies.map(function (number) {
				return allQuestions[number];
			}),
			chosenAnswers = chosenIndicies.map(function (number) {
				return allAnswers[number];
			}),

			highScores = randomTools.getNormalRandom(
				randomization.HIGH_SCORES,
				randomization.STDEV,
				randomization.GROUP_SIZE / 2
			),
			lowScores = randomTools.getNormalRandom(
				randomization.LOW_SCORES,
				randomization.STDEV,
				randomization.GROUP_SIZE / 2),
			allScores = highScores.concat(lowScores),
			randomScores = jsPsych.randomization.shuffle(allScores).map(Math.round)

		return {
			indicies: chosenIndicies,
			questions: chosenQuestions,
			answers: chosenAnswers,
			scores: randomScores
		};
	},

	getJudgementBlockTimeline: function(questions, scores) {
		var timeline = [],
			pos, text;
		for (pos = 0; pos < questions.length; pos++) {
			text = '### Topic\n\n> **' + 
				questions[pos] +
				'**\n\n> **' +
				scores[pos].toString() + 
				'** people upvoted this question\n\n' +
				'### Your Responses';
			timeline.push(
				{preamble: converter.makeHtml(text)}
			);
		}
		return timeline;
	},

	getChooseBlockQuestions: function(questions, scores) {
		var timeline = [],
			pos, text;
		for (pos = 0; pos < questions.length; pos++) {
			text = questions[pos] + ' [' + scores[pos].toString() + 
				' people upvoted this question]';
			timeline.push(text);
		}
		return timeline;
	},

	fillDisplayBlockPages: function(data, questions, scores, answers) {
		var output = [],
			resp = JSON.parse(data.responses),
			pos, text;
		output.push('### Explanations');
		for (pos = 0; pos < data.responses.length; pos++) {
			if (resp['Q' + pos.toString()] === 'Reveal Answer') {
				text = '> **' +
					questions[pos] +
					'**\n\n> **' +
					scores[pos] +
					'** people upvoted this question\n\n' +
					answers[pos] +
					'\n\n\n';
				output.push(text);
			}
		}
		return [converter.makeHtml(output.join('\n'))];
	}
}









