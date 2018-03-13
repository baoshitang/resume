
~function(g){

	g.makeTextCanvas = makeText

	function makeText( message ){
	var canvas = document.createElement("canvas")
	var w = canvas.width = 128;
	var h = canvas.height = 128;

	var ctx = canvas.getContext("2d");
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect( 1, 1, 126, 126 );

		ctx.fillStyle = "#000000";
		ctx.font = "24px Yahei";

	var ww = Math.min(ctx.measureText(message).width,128);
		ctx.fillText(message,w/2-ww/2,h/2+12);

	return canvas;
}




}(this)