// CONSTANTS
var GROUP_SIZE = 10;

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

function chooseQuestions(rawQuestions) {
	var allIndicies = randomTools.range(rawQuestions.length),
		chosenIndicies = jsPsych.randomization.sample(allIndicies, 
			GROUP_SIZE, false),
		chosenQuestions = chosenIndicies.map(function (number) {
			return rawQuestions[number];
		});
	return {
		indicies: chosenIndicies,
		questions: chosenQuestions
	};
}

function getJudgementBlockTimeline(chosenQuestions) {
	var pos,
		text,
		timeline = chosenQuestions.map(function (question) {
			var text = '### Question\n> **' + question + '**';
			return {preamble: converter.makeHtml(text)}
		});
	return timeline;
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
	required: [true, true, true, true, true, true, true],
	randomize_order: false,
	labels: randomJudgements.choices
};

// Fills out the template with questions and scores
var questionIndicies = chooseQuestions(rawQuestions);
var chosenQuestions = questionIndicies.questions
jsPsych.data.addProperties({
	questionIndicies: questionIndicies.indicies,
});


judgementBlock.timeline = getJudgementBlockTimeline(chosenQuestions);

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
	bufferBlock
];

jsPsych.init({
	timeline: timeline,
});
