$( document ).ready(function() {
	jQuery(function($) {
	    $('#kentaro').mouseover(function() {

	    	var safeColors = ['00','33','66','99','cc','ff'];
			var rand = function() {
			    return Math.floor(Math.random()*6);
			};
			var randomColor = function() {
			    var r = safeColors[rand()];
			    var g = safeColors[rand()];
			    var b = safeColors[rand()];
			    return "#"+r+g+b;
			};

			var theBody = $( "body" );
	    	var theScoreEl = $( "#score" );
	    	var tempScoreNum = parseInt(theScoreEl.text());
	    	tempScoreNum++;
	    	theScoreEl.text(tempScoreNum);
	    	$(theBody).css('background',randomColor());
	    	$(theBody).css({color:'white'},1000);


	        var dWidth = $(document).width() - 211, // image width
	            dHeight = $(document).height() - 211, // image height
	            nextX = Math.floor(Math.random() * dWidth),
	            nextY = Math.floor(Math.random() * dHeight);
	        $(this).animate({ left: nextX + 'px', top: nextY + 'px' });
	    });
	});
});

