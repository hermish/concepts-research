var randomTools = {};

randomTools.gaussRandom = function() {
    var r = 0;
    while (r === 0 || r >= 1) {
        var u = 2 * Math.random() - 1,
            v = 2 * Math.random() - 1;
        r = u * u + v * v;
    }
    var c = Math.sqrt(-2 * Math.log(r) / r);
    return u * c;
};

randomTools.getNormalRandom = function(mean, stdev, number) {
    var output = [];
    while (number > 0) {
        output.push(randomTools.gaussRandom() * stdev + mean);
        number--;
    }
    return output;
};

randomTools.range = function(endPoint) {
    return Array.apply(null, Array(endPoint)).map(
      function (_, index) {return index;}
    );
};
