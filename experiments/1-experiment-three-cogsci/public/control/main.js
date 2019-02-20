// CONSTANTS
var main = {
    MIDDLE: 24,
    HIGH_SCORES: 2405,
    LOW_SCORES: 24,
    STDEV: 10,
    GROUP_SIZE: 12,
};

// RANDOMIZATION TOOLS
/**
@param judgments: {questions: [String], 
				   choices: [[String]]}
	an object which contains the series of participant judgments and 
	accompanying choices.

@return: {questions: [String],
		  choices: [[String]],
		  indicies: [int]}
	an object which contains the series of judgements and choices in the
	identical randomized order
*/
main.createJudgmentTemplate = function (judgments) {
	var allJudgments = judgments.questions,
		allChoices = judgments.choices,
		allIndicies = randomTools.range(allJudgments.length),

		randomIndicies = jsPsych.randomization.shuffle(allIndicies),
		randomQuestions = randomIndicies.map(function (number) {
			return allJudgments[number];
		}),
		randomChoices = randomIndicies.map(function (number) {
			return allChoices[number];
		});

	return {
		questions: randomQuestions,
		choices: randomChoices,
		indicies: randomIndicies
	};
};

main.assignScores = function (questionsAndAnswers) {
	var allQuestions = questionsAndAnswers.questions,
		allAnswers = questionsAndAnswers.answers,
		allIndicies = randomTools.range(allQuestions.length),

		chosenIndicies = jsPsych.randomization.sample(allIndicies, 
			main.GROUP_SIZE, false),
		chosenQuestions = chosenIndicies.map(function (number) {
			return allQuestions[number];
		}),
		chosenAnswers = chosenIndicies.map(function (number) {
			return allAnswers[number];
		}),

		highScores = randomTools.getNormalRandom(main.HIGH_SCORES, main.STDEV,
			main.GROUP_SIZE / 3).map(Math.round),
		lowScores = randomTools.getNormalRandom(main.LOW_SCORES, main.STDEV,
			main.GROUP_SIZE / 3).map(Math.round),
        noScores = Array(main.GROUP_SIZE / 3).fill("???"),
		allScores = highScores.concat(lowScores).concat(noScores),
		randomScores = jsPsych.randomization.shuffle(allScores);

	return {
		indicies: chosenIndicies,
		questions: chosenQuestions,
		answers: chosenAnswers,
		scores: randomScores
	};
};

main.getJudgementBlockTimeline = function (questions, scores) {
	var timeline = [],
		pos, text;
	for (pos = 0; pos < questions.length; pos++) {
		text = '### Question\n> **' + 
			questions[pos] +
			'**\n\n> **' +
			scores[pos].toString() + 
			'** people upvoted this question\n\n' +
			'### Your Responses';
		timeline.push(
			{preamble: main.converter.makeHtml(text)}
		);
	}
	return timeline;
};

main.getChooseBlockQuestions = function (questions, scores) {
	var timeline = [],
		pos, text;
	for (pos = 0; pos < questions.length; pos++) {
		text = questions[pos] + ' [' + scores[pos].toString() + 
			' people upvoted this question]';
		timeline.push(text);
	}
	return timeline;
};

main.fillDisplayBlockPages = function (data, questions, scores, answers) {
	var output = [],
		resp = JSON.parse(data.responses),
		pos, text;
	output.push('### Explanations');
	for (pos = 0; pos < data.responses.length; pos++) {
		if (resp['Q' + pos.toString()] === 'Reveal Answer') {
			text = '> **' + questions[pos] + '**\n\n> **' +
				scores[pos] +
				'** people upvoted this question\n\n' +
				answers[pos] + '\n\n\n';
			output.push(text);
		}
	}
	return [main.converter.makeHtml(output.join('\n'))];
};

/* SURVEY BLOCKS */
main.converter = new showdown.Converter();

// Consent Block
// Asks participants for consent
main.consentBlock = {
	type: 'survey-multi-choice',
	preamble: [main.converter.makeHtml(literals.consentPage)],
	required: [true],
	questions: ['Do you consent to participate?'],
	options: [[
		'I do not consent to participate',
		'I consent to participate'
	]],
	on_finish: function(data) {
		var resp = JSON.parse(data.responses);
		if (resp.Q0 === "I do not consent to participate") {
			jsPsych.endExperiment(main.converter.makeHtml(
				literals.consentFailureMessage));
		}
	}
};

// PHASE I
// Displays intructions
main.instructionsBlock = {
	type: 'instructions',
	pages: [main.converter.makeHtml(literals.instructionsOne)],
	show_clickable_nav: true
};

// Create template for likert questions and fills the judgements in randomized 
// order
main.randomJudgements = main.createJudgmentTemplate(questions.judgments);
jsPsych.data.addProperties({judgmentIndicies: main.randomJudgements.indicies});

main.judgementBlock = {
	type: 'survey-likert',
	questions: main.randomJudgements.questions,
	required: [true, true, true, true, true],
	randomize_order: false,
	labels: main.randomJudgements.choices
};

// Fills out the template with questions and scores
main.questionScores = main.assignScores(questions.questionsAndAnswers);
jsPsych.data.addProperties({
	questionIndicies: main.questionScores.indicies,
	questionScores: main.questionScores.scores
});

main.judgementBlock.timeline = main.getJudgementBlockTimeline(
	main.questionScores.questions,
	main.questionScores.scores);

// PHASE II
// Display instructions
main.instructionsTwoBlock = {
	type: 'instructions',
	pages: [main.converter.makeHtml(literals.instructionsTwo)],
	show_clickable_nav: true
};

// Prompt users for 5 question to see the responses for
main.chooseBlock = {
	preamble: [main.converter.makeHtml(literals.choosePage)],
	type: 'survey-multi-choose',
	limit: 5,
	randomize_order: false,
	required: [true, true, true, true, true, true, true, true, true, true],
	options: ['Reveal Answer', 'Keep Hidden'],
};

main.chooseBlock.questions = main.getChooseBlockQuestions(
	main.questionScores.questions,
	main.questionScores.scores);

// Displays answers to questions choosen questions
main.displayBlock = {
	type: 'instructions',
	pages: function () {
		return main.fillDisplayBlockPages(
			jsPsych.data.getLastTrialData(),
			main.questionScores.questions,
			main.questionScores.scores,
			main.questionScores.answers
		);
	},
	show_clickable_nav: true
};

// Writes to database
main.bufferBlock = {
	type: 'call-function',
	func: function () {
		$.ajax({
			type: "POST",
			url: "/experiment-data",
			data: JSON.stringify(jsPsych.data.getData()),
			contentType: "application/json"
		})
		.fail(function() {
			alert("A problem occurred while writing to the database.");
			window.location.href = "/";
		})
	},
	on_finish: function(data) {
		// Displays Thank You and payement information
		jsPsych.endExperiment(main.converter.makeHtml(literals.thankYouMessage));
	}
};

// RUN EXPERIMENT
jsPsych.init({
	timeline: [
	    main.consentBlock,
	    main.instructionsBlock,
	    main.judgementBlock,
	    main.instructionsTwoBlock,
	    main.chooseBlock,
	    main.displayBlock,
	    main.bufferBlock
    ]
});
