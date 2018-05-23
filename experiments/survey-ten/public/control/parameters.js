/* EXPERIMENTAL PARAMETERS */
var parameters = Object.freeze({
    /*
    Experimental Set-Up
     */
    GROUPS: 2,
    CONDITIONS: 2,
    NUM_ARTICLES: 2,
    TOTAL_ARTICLES: 4,

    /*
    Numerical Parameters
     */
    HIGH_MEAN: 9000,
    HIGH_SD: 500,
    LOW_MEAN: 5,
    LOW_SD: 1,

    /*
    Conditional Differences
     */
    SCALES: [0.01, 1],
    ROUNDING: [1000, 1],

    /*
    Decorative Parameters
     */
    DELIMITER: '_',
    QUESTION_HEADER: '### Headline\n\n',
    RESPONSES_HEADER: '\n\n\n#### Rate your Curiosity',
    POSITIVE_SELECTION: 'Reveal Answer'
});
