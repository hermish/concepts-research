var converter = new showdown.Converter();

var output = randomization.randomize(stimuli);
var questionsAndAnswers = output.questionsAndAnswers;
var randomJudgements = output.randomJudgements;
var questionScores = output.questionScores;
var control = output.control;

jsPsych.data.addProperties({judgmentIndicies: randomJudgements.indicies});
jsPsych.data.addProperties({
	judgmentIndicies: randomJudgements.indicies,
	questionIndicies: questionScores.indicies,
	questionScores: questionScores.scores,
	control: control
});

/* -----------------------------
PHASE 0: CONSENT & INTRODUCTION
----------------------------- */
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


var overallInstructions = {
	type: 'instructions',
	pages: [converter.makeHtml(literals.overallInstructions)],
	show_clickable_nav: true
};

/* -----------------------------
PHASE 1: RATING QUESTIONS
----------------------------- */
var phaseOneIntructions = {
	type: 'instructions',
	pages: [converter.makeHtml(control ?
		literals.phaseOneControlInstructions :
		literals.phaseOneInstructions)],
	show_clickable_nav: true
};

var judgementBlock = {
	type: 'survey-likert',
	questions: randomJudgements.questions,
	required: [true, true, true, true, true, true, true],
	randomize_order: false,
	labels: randomJudgements.choices
};

judgementBlock.timeline = randomization.getJudgementBlockTimeline(
	questionScores.questions,
	questionScores.scores,
	control
);

/* -----------------------------
PHASE 2: CHOOSING QUESTIONS
----------------------------- */
var phaseTwoIntructions = {
	type: 'instructions',
	pages: [converter.makeHtml(literals.phaseTwoIntructions)],
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

chooseBlock.questions = randomization.getChooseBlockQuestions(
	questionScores.questions,
	questionScores.scores);

// Displays answers to questions choosen questions
var displayBlock = {
	type: 'instructions',
	pages: function () {
		return randomization.fillDisplayBlockPages(
			jsPsych.data.getLastTrialData(),
			questionScores.questions,
			questionScores.scores,
			questionScores.answers,
			control
		);
	},
	show_clickable_nav: true
};

/* -----------------------------
PHASE 3: WRITING DATA
----------------------------- */
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

/* -----------------------------
RUNNING THE EXPERIMENT
----------------------------- */
var timeline = [
	consentBlock,
	overallInstructions,
	
	phaseOneIntructions,
	judgementBlock,

	phaseTwoIntructions,
	chooseBlock,
	displayBlock,

	bufferBlock
];

jsPsych.init({
	timeline: timeline,
});
