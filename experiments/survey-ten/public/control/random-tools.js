/* RANDOM NUMBER TOOLS */
var randomTools = {
    /**
     * Returns a value sampled from a normal gaussian random variable using the
     * Box–Muller transform.
     */
    gaussRandom: function() {
        var r = 0;
        while (r === 0 || r >= 1) {
            var u = 2 * Math.random() - 1,
                v = 2 * Math.random() - 1;
            r = u * u + v * v;
        }
        var c = Math.sqrt(-2 * Math.log(r) / r);
        return u * c;
    },

    getSingleNormal: function(mean, standardDev) {
        return randomTools.gaussRandom() * standardDev + mean;
    },


    /**
     * Returns an array of values of length specified, sampled from the
     *  parameterized normal distribution.
     *
     * @param mean {number}: mean of normal random variable
     * @param standardDev {number}: corresponding standard deviation
     * @param number {number}: number of values required
     */
    getNormalRandom: function(mean, standardDev, number) {
        var output = [];
        while (number > 0) {
            output.push(randomTools.gaussRandom() * standardDev + mean);
            number--;
        }
        return output;
    },


    /**
     * Returns an array where exactly one half come from one normal
     *  distribution and the remaining from a second normal distribution with
     *  potentially different mean.
     *
     * @param highMean {number}: mean of first distribution
     * @param lowMean {number}: mean of second distribution
     * @param standardDev {number}: standard deviation for both
     * @param number {number}: the number in each of the two groups
     */
    getBimodalNormal: function(highMean, lowMean, standardDev, number) {
        var high = randomTools.getNormalRandom(highMean, standardDev, number),
            low = randomTools.getNormalRandom(lowMean, standardDev, number),
            allScores = high.concat(low);
        return jsPsych.randomization.shuffle(allScores);
    },


    /**
     * Returns a range array of integers [0, 1, ..., endPoint - 1].
     * @param endPoint {number}: the length required
     */
    range: function(endPoint) {
        return Array.apply(null, Array(endPoint)).map(
            function (_, index) {return index;}
        );
    },


    /**
     * Returns a random number uniformly at random from the set the range
     *  [0, 1, ..., values - 1].
     * @param values {number}: exclusive left endpoint
     */
    randomInteger: function(values) {
        return Math.floor(Math.random() * Math.floor(values))
    },


    /**
     * Returns the number i in [0, 1, ..., length - 1] with probability given
     *  by probabilities[i]. Note the empirical distribution might be marginally
     *  different from the provided due to float round-off or comparison errors.
     *
     * @param probabilities {number[]} empirical distribution of indices.
     */
    randomIndex: function(probabilities) {
        var pos,
            cumulative =  [0],
            value = Math.random();

        for (pos = 0; pos < probabilities.length; pos++) {
            cumulative.push(cumulative[pos] + probabilities[pos]);
            if (value < cumulative[pos + 1]) {
                return pos;
            }
        }
        return probabilities.length - 1;
    },


    /**
     * Returns a random array with elements in {0, 1} such that there are
     *  exactly number of each. This corresponding to assigning exactly half
     *  entries to one group and the other half to another, at random.
     *
     * @param size {number}: size of each group (i.e. number of zeros and ones
     *  respectively)
     */
    assignRandomBinaryGroups: function (size) {
        var zeros = Array.apply(null, Array(size)).map(
                Number.prototype.valueOf, 0),
            ones = Array.apply(null, Array(size)).map(
                Number.prototype.valueOf, 1),
            allGroups = zeros.concat(ones);
        return jsPsych.randomization.shuffle(allGroups);
    }
};
