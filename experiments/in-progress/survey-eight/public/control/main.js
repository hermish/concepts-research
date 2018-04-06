var converter = new showdown.Converter();

var output = randomization.randomize(stimuli);
var groupNumber = output.groupNumber;
var template = output.groupTemplate;
var randomJudgements = output.randomJudgements;
var questionScores = output.questionScores;

jsPsych.data.addProperties({
    participantID: output.participantID,
    groupNumber: groupNumber,
	judgmentIndices: randomJudgements.indices,
	questionIndices: questionScores.indices,
	questionScores: questionScores.scores
});

/**
 * PHASE 0: CONSENT & INTRODUCTION
 */

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
		if (resp['Q0'] === "I do not consent to participate") {
			jsPsych.endExperiment(converter.makeHtml(
				literals.consentFailureMessage));
		}
	}
};

var startBufferBlock = {
    type: 'call-function',
    func: function () {
        $.ajax({
            type: "POST",
            url: "/experiment-data",
            data: JSON.stringify({participantID: output.participantID}),
            contentType: "application/json"
        })
            .fail(function() {
                alert("A problem occurred while writing to the database.");
                window.location.href = "/";
            })
    }
};

var overallInstructions = {
	type: 'instructions',
	pages: [converter.makeHtml(literals.overallInstructions)],
	show_clickable_nav: true
};


/**
 * PHASE 1: RATING QUESTIONS
 */
var phaseOneInstructions = {
	type: 'instructions',
	pages: [converter.makeHtml(literals.phaseOneInstructions[groupNumber])],
	show_clickable_nav: true
};

var phaseOneQuiz = {
    type: 'survey-multi-choice',
    preamble: [converter.makeHtml('## Instructions Review')],
    required: [true, true],
    questions: stimuli.phaseOneQuiz.questions,
    options: stimuli.phaseOneQuiz.choices,
};

var judgementBlock = {
	type: 'survey-likert',
	questions: randomJudgements.questions,
	required: Array.apply(null, Array(randomJudgements.questions.length)).map(
        function() {return true}
    ),
	randomize_order: false,
	labels: randomJudgements.choices
};

judgementBlock.timeline = randomization.getJudgementBlockTimeline(
	questionScores.questions,
	questionScores.scores,
	template
);


/**
 * PHASE 2: CHOOSING QUESTIONS
 */
var phaseTwoInstructions = {
    type: 'instructions',
    pages: [converter.makeHtml(literals.phaseTwoInstructions)],
    show_clickable_nav: true
};

var phaseTwoQuiz = {
    type: 'survey-multi-choice',
    preamble: [converter.makeHtml('## Instructions Review')],
    required: [true, true],
    questions: stimuli.phaseTwoQuiz.questions,
    options: stimuli.phaseTwoQuiz.choices,
};

var chooseBlock = {
    preamble: [converter.makeHtml(literals.choosePage)],
    type: 'survey-multi-choose',
    limit: 5,
    randomize_order: false,
    required: Array.apply(null, Array(questionScores.questions)).map(
        function() {return true}
    ),
    options: ['Reveal Answer', 'Keep Hidden']
};

chooseBlock.questions = randomization.getChooseBlockQuestions(
    questionScores.questions,
    questionScores.scores,
    template
);

var displayBlock = {
    type: 'instructions',
    pages: function () {
        return randomization.fillDisplayBlockPages(
            jsPsych.data.getLastTrialData(),
            questionScores.questions,
            questionScores.scores,
            questionScores.answers,
            template
        );
    },
    show_clickable_nav: true
};


/**
 * PHASE 3: SUBMITTING DATA
 */
var submitBufferBlock = {
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
		jsPsych.endExperiment(converter.makeHtml(literals.thankYouMessage));
	}
};


/**
 * RUNNING THE EXPERIMENT
 */
var timeline = [
	consentBlock,
    startBufferBlock,
	overallInstructions,

    phaseOneInstructions,
    phaseOneQuiz,
    judgementBlock,

    phaseTwoInstructions,
    phaseTwoQuiz,
    chooseBlock,
    displayBlock,

    submitBufferBlock
];

jsPsych.init({
	timeline: timeline
});
