;
// jquery.jigsaw is based on the 'Jigsy' javascript puzzle on Cityposh.com.
// I really enjoy the game, and I thought I'd try out some code for creating a similar game.
(function($) { 
	// opt:
	// 	win: function(pieces) { }
	//  target: element
	//  blank: 'TL'|'TR'|'BL'|'BR'
	//  randomize: function(pieces, defaultFunction) { }
	var jigsaw = function(opt) {
		return this.load(function() { 
			var originalImg, 
				width, 
				height, 
				imageSrc, 
				blankLocation = jigsaw.Corner[opt.blank] || jigsaw.Corner.TR, 
				target = opt.target || { },
				squares = opt.size || 5, 
				randomize = opt.randomize;
				
			if(this instanceof HTMLImageElement) {
				originalImg = $(this);
			} else {
				originalImg = $('img:first', this);
			}
			
			width = originalImg.width();
			height = originalImg.height();
			imageSrc = originalImg.attr('src');
			
			// ensure output target exists
			if(!target) {
				target = $('<div class="jigsaw_target"></div>');
				originalImg.after(target);
			}
			
			$(target).width(width);
			$(target).height(height);
			
			// setup board
			var pieces = new Array();
			for(var row = 0, len = squares; row < len; row++) {
				pieces.push(new Array(squares));
				for(var column = 0, sizeW = width/squares, sizeH = height/squares ;column < len; column++) {
					// create divs, displacing background
					var piece = $('<div class="jigsaw_piece"></div>');
					piece.css({ 
						'float': 'left',
						'background': ('url(\'' + imageSrc + '\') ' + sizeW * row + ' ' + sizeH * column ),
						'height': sizeH + 'px',
						'width': sizeW + 'px',
						'cursor': 'pointer'
					});
					piece.click(function() {
						var d = jigsaw.draw;
						d.call(jigsaw, this);
					});
					pieces[row][column] = piece;					
				}
			}
			
			var blank; 
			// "place" blank square
			switch(blankLocation) {
				case jigsaw.Corner.TL:
				blank = pieces[0][0];
				break;
				case jigsaw.Corner.TR:
				blank = pieces[0][squares-1];
				break;
				case jigsaw.Corner.BL:
				blank = pieces[squares-1][0];
				break;
				case jigsaw.Corner.BR:
				default:
				blank =	pieces[squares-1][squares-1];
				break;
			}			
			$(blank).css({ 'background': 'none'});
			
			var defaultRandomizer = function() {
				var t = target, p = pieces, s = squares;
				for(var randX = Math.ceil(Math.random() * (s*2)); randX < s && randX > -1; randX--) {					
					for(var randY = Math.ceil(Math.random() * (s*2)); randY < s && randY > -1; randY--){
						console.log('['+ randX +','+ randY +']');
						var moveX = pieces[randX][randY];
						var moveY = pieces[randY][randX];
						if(moveX != blank && moveY != blank) {
							try{
							pieces[randX][randY] = moveY
							pieces[randY][randX] = moveX;
							} catch(err) { 
								console.error(err);
							}
						}
					}
				}			
				for(var rr = s-1; rr >= 0; rr--) {
					for(var rc = s-1; rc >= 0; rc--) {
						t.append(p[rr][rc]);
					}
				} 
			}
			
			if(randomize) randomize.call(this, pieces, defaultRandomizer);
			else defaultRandomizer();
			
			$(originalImg).hide();
			
			// draw
			jigsaw.draw = function(elem) {
				console.log(elem);
			}
			
			// validate 
			jigsaw.validate = function() {
				var t = target, p = pieces, valid = true;			
				for(var rr = s-1; valid && rr >= 0; rr--) {
					for(var rc = s-1; rc >= 0; rc--) {
						// get piece offset from parent
						// validate against background position
					}
				}
				return valid;
			}
		});
	};	
	
	// Settings lookup. 1 so jigsaw.Corner[value] || default works
	jigsaw.Corner = { TL: 1, TR: 2, BL: 3, BR: 4 };
	$.fn.jigsaw = jigsaw;	
		
})(jQuery);
