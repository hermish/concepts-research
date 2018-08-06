/* TRIAL & GROUP RANDOMIZATION TOOLS */
var randomization = {
    /**
     * Makes the series of random choices which determines the experiment
     *  a participant will be put through.
     * @param stimuli: the literal object which contains questions and answers
     */
    randomize: function(stimuli) {
        var participantID = jsPsych.randomization.randomID(),
            groupNumber = randomTools.randomInteger(parameters.GROUPS),
            conditionNumber = randomTools.randomInteger(parameters.CONDITIONS),
            groupTemplate = stimuli.templates[conditionNumber],
            randomJudgements = randomization.shuffleJudgments(
                stimuli.judgments,
                randomTools.range(stimuli.judgments.length)),
            randomArticles = randomization.chooseArticles(
                groupNumber,
                stimuli.articles);

        return {
            participantID: participantID,
            groupNumber: groupNumber,
            conditionNumber: conditionNumber,
            groupTemplate: groupTemplate,
            randomJudgements: randomJudgements,
            randomArticles: randomArticles
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
     * Returns the articles so exactly five are randomly chosen from the first
     *  group, and five from the second. One half of these are assigned high
     *  numbers, while the other half low number; the higher numbers are
     *  assigned to the group corresponding to the groupNumber argument.
     * @param groupNumber {number}: number corresponding to the high group
     * @param articles: literal object containing articles' headlines and text
     */
    chooseArticles: function(groupNumber, articles) {
        var firstChoices = articles[0].headlines.length,
            firstIndices = jsPsych.randomization.sample(
                randomTools.range(firstChoices),
                parameters.NUM_ARTICLES,
                false
            ),
            secondChoices = articles[1].headlines.length,
            secondIndices = jsPsych.randomization.sample(
                randomTools.range(secondChoices),
                parameters.NUM_ARTICLES,
                false
            ),
            lowNumbers = randomTools.getNormalRandom(
                parameters.LOW_MEAN,
                parameters.LOW_SD,
                parameters.NUM_ARTICLES).map(function(value) {
                    return Math.round(value * 10) / 10;
            }),
            highNumbers = randomTools.getNormalRandom(
                parameters.HIGH_MEAN,
                parameters.HIGH_SD,
                parameters.NUM_ARTICLES).map(function(value) {
                return Math.round(value * 10) / 10;
            }),
            allIndices = firstIndices.concat(secondIndices),
            allNumbers = groupNumber === 0 ?
                highNumbers.concat(lowNumbers) :
                lowNumbers.concat(highNumbers);

        return randomization.mergeChoices(
            allIndices,
            allNumbers,
            articles
        );
    },

    /**
     * Collects information about the experiment set up based on random choices
     *  made previously, and packages this into an object.
     * @param chosenIndices: indices of articles from the first group, followed
     *  by those in the second group
     * @param chosenNumbers: corresponding numbers assigned to each of these
     *  headlines
     * @param articles: literal object containing articles' headlines and text
     */
    mergeChoices: function(chosenIndices, chosenNumbers, articles) {
        var indices = randomTools.range(parameters.TOTAL_ARTICLES),
            choices = jsPsych.randomization.shuffle(indices),
            randomGroups = [],
            randomIndices = [],
            randomHeadlines = [],
            randomText = [],
            randomNumbers = [],
            group, index;

        choices.forEach(function (value) {
            group = Math.floor(value / parameters.NUM_ARTICLES);
            index = chosenIndices[value];
            randomGroups.push(group);
            randomIndices.push(index);
            randomHeadlines.push(articles[group].headlines[index]);
            randomText.push(articles[group].text[index]);
            randomNumbers.push(chosenNumbers[value])
        });

        return {
            randomGroups: randomGroups,
            randomIndices: randomIndices,
            randomHeadlines: randomHeadlines,
            randomText: randomText,
            randomNumbers: randomNumbers
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
     * @param template {string}: pre-format string explaining number meaning
     */
    fillDisplayBlockPages: function(data, questions, scores, answers,
                                    template) {
        var selections = randomization.parseSelections(data),
            output = [],
            pos, number, text;

        for (pos = 0; pos < selections.length; pos++) {
            number = selections[pos];
            text = randomization.formatBoldQuestions(questions[number],
                scores[number], template) +
                '\n\n' + answers[number] + '\n\n';
            output.push(converter.makeHtml(text))
        }
        return output;
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
