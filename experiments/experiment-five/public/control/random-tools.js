var randomTools = {
	range: function(endPoint) {
		return Array.apply(null, Array(endPoint)).map(
			function (_, index) {return index;}
		);
	}
}