var randomization = {
	MIDDLE: 240,
	HIGH_SCORES: 2405,
	LOW_SCORES: 24,
	STDEV: 10,
	GROUP_SIZE: 10,
	NUMBER_EXPLANATION: 'Post #',
	QUESTION_HEADER: '### Question\n\n',
	RESPONSES_HEADER: '\n\n### Your Responses',
	EXPLANATION_HEADER: '### Explanations',


	randomize: function(stimuli) {
		var control = false,
			questionsAndAnswers = randomization.getQuestionsAndAnswers(stimuli.questionInformation),
			randomJudgements = randomization.createJudgmentTemplate(stimuli.judgments),
			questionScores = randomization.assignScores(questionsAndAnswers);

		return {
			questionsAndAnswers: questionsAndAnswers,
			randomJudgements: randomJudgements,
			questionScores: questionScores,
			control: control
		};
	},

	getQuestionsAndAnswers: function(questionInformation) {
		return {
			questions: stimuli.questionInformation.questions,
			answers: stimuli.questionInformation.answers
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

	formatBoldQuestions: function(question, score, control) {
		var text = '> **' + question + '**';
		if (!control) {
			text += '\n\n> '
			text += randomization.NUMBER_EXPLANATION + ' **' + score.toString() + '** ';
		}
		return text;
	},

	formatRomanQuestions: function(question, score, control) {
		var text = question;
		if (!control) {
			text += ' [' + randomization.NUMBER_EXPLANATION + ' ' + score.toString() + ']';
		}
		return text;
	},

	getJudgementBlockTimeline: function(questions, scores, control) {
		var timeline = [],
			pos, text;
		for (pos = 0; pos < questions.length; pos++) {
			text =
				randomization.QUESTION_HEADER + 
				randomization.formatBoldQuestions(questions[pos], scores[pos], control) +
				randomization.RESPONSES_HEADER;
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
			text = randomization.formatRomanQuestions(questions[pos], scores[pos], control);
			timeline.push(text);
		}
		return timeline;
	},

	fillDisplayBlockPages: function(data, questions, scores, answers, control) {
		var output = [],
			resp = JSON.parse(data.responses),
			pos, text;
		output.push(randomization.EXPLANATION_HEADER);
		for (pos = 0; pos < data.responses.length; pos++) {
			if (resp['Q' + pos.toString()] === 'Reveal Answer') {
				text =
					randomization.formatBoldQuestions(questions[pos], scores[pos], control) +
					'\n\n\n';
				output.push(text);
			}
		}
		return [converter.makeHtml(output.join('\n'))];
	}
}
