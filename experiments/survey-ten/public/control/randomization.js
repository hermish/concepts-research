/* TRIAL & GROUP RANDOMIZATION TOOLS */
var randomization = {
    /**
     * Makes the series of random choices which determines the experiment
     *  a participant will be put through.
     *
     * @param stimuli: the literal object which contains randomization output
     */
    randomize: function(stimuli) {
        var participantID = jsPsych.randomization.randomID(),
            groupNumber = 1, // Force high science numbers
            conditionNumber = randomTools.randomInteger(parameters.CONDITIONS),
            conditionTemplate = stimuli.templates[conditionNumber],
            randomJudgements = randomization.shuffleJudgments(
                stimuli.judgments,
                randomTools.range(stimuli.judgments.length)),
            randomArticles = randomization.chooseArticles(
                conditionNumber,
                groupNumber,
                stimuli.articles
            );

        return {
            participantID: participantID,
            groupNumber: groupNumber,
            conditionNumber: conditionNumber,
            conditionTemplate: conditionTemplate,
            randomJudgements: randomJudgements,
            randomArticles: randomArticles
        };
    },


    /**
     * Shuffles both the judgements and choices and keeps track of their
     *  original position in the literal array.
     *
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
     * Returns the articles so exactly the same number are randomly chosen
     *  from the first group, and the second. One half of these are assigned
     *  high numbers, while the other half low numbers; the higher numbers are
     *  assigned to the group corresponding to the GROUP_NUMBER argument.
     *
     * The CONDITION_NUMBER determines the scale of numbers and round-off
     *  precision, as set in the parameters.
     *
     * @param conditionNumber {number}: the condition number
     * @param groupNumber {number}: number corresponding to the high group
     * @param articles: literal object containing articles' headlines and text
     */
    chooseArticles: function(conditionNumber, groupNumber, articles) {
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
                parameters.NUM_ARTICLES).map(function (value) {
                    return randomization.produceNumber(value, conditionNumber);
            }),
            highNumbers = randomTools.getNormalRandom(
                parameters.HIGH_MEAN,
                parameters.HIGH_SD,
                parameters.NUM_ARTICLES).map(function (value) {
                return randomization.produceNumber(value, conditionNumber);
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
     * Scales and rounds a number according to the rules set for the condition
     *  in the parameters.
     *
     * @param value {number}: number to scale and round
     * @param conditionNumber {number}: the condition number
     */
    produceNumber: function(value, conditionNumber) {
        var scale = parameters.SCALES[conditionNumber],
            rounding = parameters.ROUNDING[conditionNumber];
        return Math.round(value * scale * rounding) / rounding;
    },


    /**
     * Collects information about the experiment set up based on random choices
     *  made previously, and packages this into an object.
     *
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
     * Makes the Judgement Block timeline for phase one of the experiment.
     *
     * @param questions {string[]} questions to be presented
     * @param numbers {number[]} corresponding numbers
     * @param template {string}: pre-format string explaining number meaning
     */
    getJudgementBlockTimeline: function(questions, numbers, template) {
        var line;
        return questions.map(function (value, index) {
            line = parameters.QUESTION_HEADER;
            line += formatting.formatBoldQuestions(
                value,
                numbers[index],
                template
            );
            line += parameters.RESPONSES_HEADER;
            return {preamble: converter.makeHtml(line)};
        });
    },


    /**
     * Makes a list of questions that will be used in the experiment.
     *
     * @param questions {string[]} questions to be presented
     * @param numbers {number[]} corresponding numbers
     * @param template {string}: pre-format string explaining number meaning
     */
    getChooseBlockQuestions: function(questions, numbers, template) {
        var line;
        return questions.map(function (value, index) {
            line = formatting.formatRomanQuestions(
                value,
                numbers[index],
                template
            );
            return line;
        });
    },


    /**
     * Puts together an array representing a list of HTML pages to display,
     *  one headline on each page. Notice this function defers from
     *  FILL_DISPLAY_BLOCK_PAGES in that every question is displayed,
     *  independent of any choices of the participant.
     *
     * @param questions {string[]}: questions to be presented
     * @param numbers {number[]}: corresponding scores
     * @param text {string[]}: corresponding text
     * @param template {string}: pre-format string explaining number meaning
     */
    staticDisplayBlockPages: function (questions, numbers, text, template) {
        var output = Array.apply(null, Array(questions.length)),
            line;
        return output.map(function (value, index) {
            line = formatting.formatBoldQuestions(
                questions[index],
                numbers[index],
                template
            );
            line += '\n\n' + text[index] + '\n\n';
            return converter.makeHtml(line);
        });
    },


    /**
     * Sifts through participant question choices to reveal corresponding
     *  questions and answers. Puts together an array representing a list of
     *  HTML pages to display, one headline selected on each page.
     *
     * @param data: user data, provided by the psychology library
     * @param questions {string[]}: questions to be presented
     * @param numbers {number[]}: corresponding scores
     * @param text {string[]}: corresponding text
     * @param template {string}: pre-format string explaining number meaning
     */
    fillDisplayBlockPages: function(data, questions, numbers, text, template) {
        var selections = randomization.parseSelections(data),
            line;
        return selections.map(function (value) {
            line = formatting.formatBoldQuestions(
                questions[value],
                numbers[value],
                template
            );
            line += '\n\n' + text[value] + '\n\n';
            return converter.makeHtml(line);
        });
    },


    /**
     * Goes through all responses and returns an array with the indices of all
     *  the questions selected by the participant.
     *
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
