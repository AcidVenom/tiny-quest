/// Lerps from one position to another
Math.lerp = function(x1, y1, x2, y2, ratio)
{
	var xx = x2 - x1;
	var yy = y2 - y1;

	return {x: x1 + xx * ratio, y: y1 + yy * ratio}
}

/// Returns the distance between 2 points
Math.distance = function(x1,y1,x2,y2)
{
	var dx = x2 - x1;
	var dy = y2 - y1;
	return Math.sqrt(dx*dx + dy*dy);
}