// CONSTANTS
var MIDDLE = 240,
	HIGH_SCORES = 2405,
	LOW_SCORES = 24,
	STDEV = 10,
	GROUP_SIZE = 10;

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
	indentical randomized order
*/
function createJudgmentTemplate(judgments) {
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
}

function assignScores(questionsAndAnswers) {
	var allQuestions = questionsAndAnswers.questions,
		allAnswers = questionsAndAnswers.answers,
		allIndicies = randomTools.range(allQuestions.length),

		chosenIndicies = jsPsych.randomization.sample(allIndicies, 
			GROUP_SIZE, false),
		chosenQuestions = chosenIndicies.map(function (number) {
			return allQuestions[number];
		}),
		chosenAnswers = chosenIndicies.map(function (number) {
			return allAnswers[number];
		}),

		highScores = randomTools.getNormalRandom(HIGH_SCORES, STDEV,
			GROUP_SIZE / 2),
		lowScores = randomTools.getNormalRandom(LOW_SCORES, STDEV,
			GROUP_SIZE / 2),
		allScores = highScores.concat(lowScores),
		randomScores = jsPsych.randomization.shuffle(allScores).map(Math.round)

	return {
		indicies: chosenIndicies,
		questions: chosenQuestions,
		answers: chosenAnswers,
		scores: randomScores
	};
}

function getJudgementBlockTimeline(questions, scores) {
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
			{preamble: converter.makeHtml(text)}
		);
	}
	return timeline;
}

function getChooseBlockQuestions(questions, scores) {
	var timeline = [],
		pos, text;
	for (pos = 0; pos < questions.length; pos++) {
		text = questions[pos] + ' [' + scores[pos].toString() + 
			' people upvoted this question]';
		timeline.push(text);
	}
	return timeline;
}

function fillDisplayBlockPages(data, questions, scores, answers) {
	var output = [],
		resp = JSON.parse(data.responses),
		pos, text;
	output.push('### Explanations');
	for (pos = 0; pos < data.responses.length; pos++) {
		if (resp['Q' + pos.toString()] === 'Reveal Answer') {
			text = '> **' + questions[pos] + '**\n\n> **' +
				scores[pos] +
				'** people upvoted this question\n\n' +
				answers[pos];
			output.push(text);
		}
	}
	return [converter.makeHtml(output.join('\n'))];
}

/* SURVEY BLOCKS */
var converter = new showdown.Converter();

// Consent Block
// Asks participants for consent
var consentBlock = {
	type: 'survey-multi-choice',
	preamble: [converter.makeHtml(literals.consentPage)],
	required: [true],
	questions: ['Do you consent to participate?'],
	options: [[
		'I do not consent to participate',
		'I consent to participate'
	]],
	on_finish: function(data) {
		var resp = JSON.parse(data.responses);
		if (resp.Q0 === "I do not consent to participate") {
			jsPsych.endExperiment(converter.makeHtml(
				literals.consentFailureMessage));
		}
	}
};

// PHASE I
// Displays intructions
var instructionsBlock = {
	type: 'instructions',
	pages: [converter.makeHtml(literals.instructionsOne)],
	show_clickable_nav: true
};

// Create template for likert questions and fills the judgements in randomized 
// order
var randomJudgements = createJudgmentTemplate(judgments);
jsPsych.data.addProperties({judgmentIndicies: randomJudgements.indicies});

var judgementBlock = {
	type: 'survey-likert',
	questions: randomJudgements.questions,
	required: [true, true, true, true, true],
	randomize_order: false,
	labels: randomJudgements.choices
};

// Fills out the template with questions and scores
var questionScores = assignScores(questionsAndAnswers);
jsPsych.data.addProperties({
	questionIndicies: questionScores.indicies,
	questionScores: questionScores.scores
});

judgementBlock.timeline = getJudgementBlockTimeline(
	questionScores.questions,
	questionScores.scores);

// PHASE II
// Display instructions
var instructionsTwoBlock = {
	type: 'instructions',
	pages: [converter.makeHtml(literals.instructionsTwo)],
	show_clickable_nav: true
};

// Prompt users for 5 question to see the responses for
var chooseBlock = {
	preamble: [converter.makeHtml(literals.choosePage)],
	type: 'survey-multi-choose',
	limit: 5,
	randomize_order: false,
	required: [true, true, true, true, true, true, true, true, true, true],
	options: ['Reveal Answer', 'Keep Hidden'],
};

chooseBlock.questions = getChooseBlockQuestions(
	questionScores.questions,
	questionScores.scores);

// Displays answers to questions choosen questions
var displayBlock = {
	type: 'instructions',
	pages: function () {
		return fillDisplayBlockPages(
			jsPsych.data.getLastTrialData(),
			questionScores.questions,
			questionScores.scores,
			questionScores.answers
		);
	},
	show_clickable_nav: true
};

// Writes to database
var bufferBlock = {
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
		jsPsych.endExperiment(converter.makeHtml(literals.thankYouMessage));
	}
};

// RUN EXPERIMENT
var timeline = [
	consentBlock,
	instructionsBlock,
	judgementBlock,
	instructionsTwoBlock,
	chooseBlock,
	displayBlock,
	bufferBlock
];

jsPsych.init({
	timeline: timeline,
});
