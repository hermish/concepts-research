var main = {
    converter: new showdown.Converter(),
	writeExperimentData: function (input) {
		$.ajax({
		  type: "POST",
		  url: "/experiment-data",
		  data: input,
		  contentType: "application/json"
		}).fail(function () {
		  alert("Error! Please contact the researcher.");
		  window.location.href = "/";
		})
  	},
};

main.randomJudgements = helpers.createJudgmentTemplate(questions.judgments);
main.questionScores = helpers.assignScores(questions.questionsAndAnswers);
main.judgmentTimeline = helpers.getJudgementBlockTimeline(
	main.questionScores.questions,
	main.questionScores.scores
);
main.participantID = jsPsych.randomization.randomID();


// INITIAL
main.blocks = {};
main.blocks.consentBlock = {
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
main.blocks.instructionsBlock = {
	type: 'instructions',
	pages: [main.converter.makeHtml(literals.instructionsOne)],
	show_clickable_nav: true
};

main.blocks.judgementBlock = {
	type: 'survey-likert',
	questions: main.randomJudgements.questions,
	required: new Array(main.randomJudgements.questions.length).fill(true),
	randomize_order: false,
	labels: main.randomJudgements.choices,
	timeline: main.judgmentTimeline
};

// BACK MATTER
main.blocks.finalDataBuffer = {
	type: 'call-function',
	func: function () {
		main.writeExperimentData(JSON.stringify(jsPsych.data.getData()));
	},
	on_finish: function(data) {
		jsPsych.endExperiment(main.converter.makeHtml(literals.thankYouMessage));
	}
};

/* RUN EXPERIMENT */
jsPsych.data.addProperties({
	responseType: 'finish',
	questionIndicies: main.questionScores.indicies,
	questionScores: main.questionScores.scores,
	judgmentIndicies: main.randomJudgements.indicies,
	participantID: main.participantID
});

jsPsych.init({
	timeline: [
	    main.blocks.consentBlock,
	    main.blocks.instructionsBlock,
	    main.blocks.judgementBlock,
	    // main.blocks.instructionsTwoBlock,
	    // main.blocks.chooseBlock,
	    // main.blocks.displayBlock,
	    main.blocks.finalDataBuffer
    ]
});

// main.chooseBlockQuestions = helpers.getChooseBlockQuestions(
// 	main.questionScores.questions,
// 	main.questionScores.scores
// );
//
// // PHASE II
// main.blocks.instructionsTwoBlock = {
// 	type: 'instructions',
// 	pages: [main.converter.makeHtml(literals.instructionsTwo)],
// 	show_clickable_nav: true
// };
//
// main.blocks.chooseBlock = {
// 	preamble: [main.converter.makeHtml(literals.choosePage)],
// 	type: 'survey-multi-choose',
// 	limit: 5,
// 	randomize_order: false,
// 	required: new Array(main.questionScores.questions.length).fill(true),
// 	options: ['Reveal Answer', 'Keep Hidden'],
// 	questions: main.chooseBlockQuestions
// };
//
// main.blocks.displayBlock = {
// 	type: 'instructions',
// 	pages: function () {
// 		return helpers.fillDisplayBlockPages(
// 			jsPsych.data.getLastTrialData(),
// 			main.questionScores.questions,
// 			main.questionScores.scores,
// 			main.questionScores.answers
// 		);
// 	},
// 	show_clickable_nav: true
// };
