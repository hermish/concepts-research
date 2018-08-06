var converter = new showdown.Converter();

var output = randomization.randomize(stimuli);
var conditionNumber = output.conditionNumber;
var groupNumber = output.groupNumber;
var groupTemplate = output.groupTemplate;
var randomJudgements = output.randomJudgements;
var randomArticles = output.randomArticles;

jsPsych.data.addProperties({
    responseType: 0,
    participantID: output.participantID,
    groupNumber: groupNumber,
    conditionNumber: conditionNumber,
	judgmentIndices: randomJudgements.indices,
    articleGroups: randomArticles.randomGroups,
    articleIndices: randomArticles.randomIndices,
    articleNumbers: randomArticles.randomNumbers
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
            data: JSON.stringify({
                responseType: 1,
                participantID: output.participantID,
                groupNumber: groupNumber,
                conditionNumber: conditionNumber
			}),
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
	pages: [converter.makeHtml(literals.phaseOneInstructions[conditionNumber])],
	show_clickable_nav: true
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
	randomArticles.randomHeadlines,
    randomArticles.randomNumbers,
    groupTemplate
);


/**
 * PHASE 2: CHOOSING QUESTIONS
 */
var phaseTwoInstructions = {
    type: 'instructions',
    pages: [converter.makeHtml(literals.phaseTwoInstructions)],
    show_clickable_nav: true
};

var chooseBlock = {
    preamble: [converter.makeHtml(literals.choosePage)],
    type: 'survey-multi-choose',
    limit: parameters.NUM_ARTICLES,
    randomize_order: false,
    required: Array.apply(null, Array(randomArticles.randomHeadlines)).map(
        function() {return true}
    ),
    options: ['Reveal Answer', 'Keep Hidden']
};

chooseBlock.questions = randomization.getChooseBlockQuestions(
    randomArticles.randomHeadlines,
    randomArticles.randomNumbers,
    groupTemplate
);

var displayBlock = {
    type: 'instructions',
    pages: function () {
        return randomization.fillDisplayBlockPages(
            jsPsych.data.getLastTrialData(),
            randomArticles.randomHeadlines,
            randomArticles.randomNumbers,
            randomArticles.randomText,
            groupTemplate
        );
    },
    show_clickable_nav: true
};

/**
 * PHASE 4: SUBMITTING DATA
 */
var attentionQuiz = {
    type: 'survey-multi-choice',
    preamble: [converter.makeHtml('## Quiz')],
    required: [true, true],
    questions: stimuli.attentionQuiz.questions,
    options: stimuli.attentionQuiz.choices
};

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
    judgementBlock,

    phaseTwoInstructions,
    chooseBlock,
    displayBlock,

    attentionQuiz,
    submitBufferBlock
];

jsPsych.init({
	timeline: timeline
});
