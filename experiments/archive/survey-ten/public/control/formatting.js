/* STRING MANIPULATION TOOLS */
var formatting = {
    /**
     * Returns an interpolated string by replacing delimiter characters with a
     *  string provided. If there are no such characters, then the template
     *  itself is returned with no substitutions.
     *
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
     *
     * @param question {string}: text of the actual question
     * @param score {number}: corresponding number
     * @param template {string}: pre-format string explaining the meaning of the
     *  number
     */
    formatBoldQuestions: function(question, score, template) {
        var frontMatter = '> **' + question + '**',
            formatted = '**' + score + '**',
            interpolate = formatting.formatTemplate(template, formatted);

        return interpolate === '' ? frontMatter : frontMatter + '\n\n>'
            + interpolate;
    },


    /**
     * Inserts a score into the template, and then constructs a string with this
     *  description present along with the question itself. Uses a roman style
     *  for Phase 2. If the template is empty, just the question is returned.
     *
     * @param question {string}: text of the actual question
     * @param score {number}: corresponding number
     * @param template {string}: pre-format string explaining the meaning of the
     *  number
     */
    formatRomanQuestions: function(question, score, template) {
        var interpolate = formatting.formatTemplate(template,
            score.toString()),
            formatted = question + ' [' + interpolate + ']';
        return interpolate === '' ? question : formatted;
    }
};