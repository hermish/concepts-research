/* TRIAL & GROUP RANDOMIZATION TOOLS */
var randomization = {
    /**
     * Makes the series of random choices which determines the experiment
     *  a participant will be put through.
     * @param stimuli: the literal object which contains questions and answers
     */
    randomize: function(stimuli) {
        var participantID = jsPsych.randomization.randomID(),
            groupNumber = randomTools.randomInteger(stimuli.conditions.length),
            groupTemplate = stimuli.conditions[groupNumber].template,
            questionsAndAnswers = randomization.getQuestionsAndAnswers(
                stimuli.questionInformation),
            randomJudgements = randomization.shuffleJudgments(
                stimuli.judgments,
                stimuli.conditions[groupNumber].questions),
            questionScores = randomization.setupQuestions(questionsAndAnswers);

        return {
            participantID: participantID,
            groupNumber: groupNumber,
            groupTemplate: groupTemplate,
            randomJudgements: randomJudgements,
            questionScores: questionScores
        };
    },

    /**
     * Packages relevant questions and corresponding answers into a single
     *  object.
     *
     * @param questionInformation: literal object which contains at least the
     *  questions and answers
     */
    getQuestionsAndAnswers: function(questionInformation) {
        return {
            questions: questionInformation.questions,
            answers: questionInformation.answers
        };
    },

    /**
     * Shuffles both the judgements and choices and keeps track of their
     *  original position in the literal array.
     * @param judgments: the literal object which contains the judgement
     *  questions to ask participants and the corresponding choices
     * @param included {number[]}: an array of indices specifying questions
     *  to be included
     */
    shuffleJudgments: function(judgments, included) {
        var allJudgments = judgments.questions,
            allChoices = judgments.choices,

            randomIndices = jsPsych.randomization.shuffle(included),
            randomJudgments = randomIndices.map(function (number) {
                return allJudgments[number];
            }),
            randomChoices = randomIndices.map(function (number) {
                return allChoices[number];
            });

        return {
            indices: randomIndices,
            questions: randomJudgments,
            choices: randomChoices
        };
    },

    /**
     * Randomly samples 10 question from those available, and assigns half
     *  high numbers and half low numbers based on the parameters set. The
     *  function also keeps track of selected question's original position in
     *  the literal array.
     * @param questionsAndAnswers: the literal object which contains the
     *  questions and corresponding answers.
     */
    setupQuestions: function(questionsAndAnswers) {
        var allQuestions = questionsAndAnswers.questions,
            allAnswers = questionsAndAnswers.answers,
            allIndices = randomTools.range(allQuestions.length),

            chosenIndices = jsPsych.randomization.sample(
                allIndices, parameters.GROUP_SIZE * 2, false),
            chosenQuestions = chosenIndices.map(function (number) {
                return allQuestions[number];
            }),
            chosenAnswers = chosenIndices.map(function (number) {
                return allAnswers[number];
            }),

            randomScores = randomTools.getBimodalNormal(
                parameters.HIGH_SCORES,
                parameters.LOW_SCORES,
                parameters.STANDARD_DEVIATION,
                parameters.GROUP_SIZE
            ).map(Math.round);

        return {
            indices: chosenIndices,
            questions: chosenQuestions,
            answers: chosenAnswers,
            scores: randomScores
        };
    },

    /**
     * Returns an interpolated string by replacing delimiter characters with a
     *  string provided. If there are no such characters, then the template
     *  itself is returned with no substitutions.
     * @param template {string}: template string possibly containing delimiters
     * @param number {string}: the string to fill in
     */
    formatTemplate: function(template, number) {
        var components = template.split(parameters.DELIMITER);
        return components.length > 1 ? components.join(number) :
            template;
    },

    /**
     * Inserts a score into the template, and then constructs a string with this
     *  description present along with the question itself. Uses a bold style
     *  for Phase 1. If the template is empty, just the question is returned.
     * @param question {string}: text of the actual question
     * @param score {number}: corresponding number
     * @param template {string}: pre-format string explaining the meaning of the
     *  number
     */
    formatBoldQuestions: function(question, score, template) {
        var frontMatter = '> **' + question + '**',
            formatted = '**' + score + '**',
            interpolate = randomization.formatTemplate(template, formatted);

        return interpolate === '' ? frontMatter : frontMatter + '\n\n>'
            + interpolate;
    },

    /**
     * Inserts a score into the template, and then constructs a string with this
     *  description present along with the question itself. Uses a roman style
     *  for Phase 2. If the template is empty, just the question is returned.
     * @param question {string}: text of the actual question
     * @param score {number}: corresponding number
     * @param template {string}: pre-format string explaining the meaning of the
     *  number
     */
    formatRomanQuestions: function(question, score, template) {
        var interpolate = randomization.formatTemplate(template,
            score.toString()),
            formatted = question + ' [' + interpolate + ']';
        return interpolate === '' ? question : formatted;
    },


    /**
     * Makes the Judgement Block timeline for phase one of the experiment.
     * @param questions {string[]} questions to be presented
     * @param scores {number[]} corresponding scores
     * @param template {string}: pre-format string explaining number meaning
     */
    getJudgementBlockTimeline: function(questions, scores, template) {
        var timeline = [],
            pos, text;
        for (pos = 0; pos < questions.length; pos++) {
            text = parameters.QUESTION_HEADER +
                randomization.formatBoldQuestions(questions[pos], scores[pos],
                    template) +
                parameters.RESPONSES_HEADER;
            timeline.push(
                {preamble: converter.makeHtml(text)}
            );
        }
        return timeline;
    },

    /**
     * Makes a list of questions that will be used in the experiment.
     * @param questions {string[]} questions to be presented
     * @param scores {number[]} corresponding scores
     * @param template {string}: pre-format string explaining number meaning
     */
    getChooseBlockQuestions: function(questions, scores, template) {
        var timeline = [],
            pos, text;
        for (pos = 0; pos < questions.length; pos++) {
            text = randomization.formatRomanQuestions(questions[pos],
                scores[pos], template);
            timeline.push(text);
        }
        return timeline;
    },

    /**
     * Sifts through participant question choices to reveal corresponding
     *  questions and answers. Puts together an array representing a list of
     *  HTML pages to display, which will consist of one entry, including all
     *  selected questions and answers.
     * @param data: user data, provided by the psychology library
     * @param questions {string[]}: questions to be presented
     * @param scores {number[]}: corresponding scores
     * @param answers {string[]}: corresponding answers
     * @param included {number[]}: an array of indices specifying questions
     *  to be included
     * @param template {string}: pre-format string explaining number meaning
     */
    fillDisplayBlockPages: function(data, questions, scores, answers, included,
                                    template) {
        var selections = randomization.parseSelections(data),
            standardized = selections.map(function (number) {
                return included[number];
            }),
            output = [],
            pos, number, text;

        output.push(parameters.EXPLANATION_HEADER);
        for (pos = 0; pos < standardized.length; pos++) {
            number = standardized[pos];
            text = randomization.formatBoldQuestions(questions[number],
                scores[number], template) +
                '\n\n' + answers[number] + '\n\n';
            output.push(text)
        }
        return [converter.makeHtml(output.join('\n\n'))];
    },

    /**
     * Goes through all responses and returns an array with the indices of all
     *  the questions selected by the participant.
     * @param data: user data, provided by the psychology library
     */
    parseSelections: function(data) {
        var allIndices = randomTools.range(data.responses.length),
            resp = JSON.parse(data.responses);
        return allIndices.filter(function (pos) {
            return resp['Q' + pos.toString()] === parameters.POSITIVE_SELECTION
        });
    }
};
