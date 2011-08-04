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
		var noop = function() { };
		
		var settings = { 
			win: noop,
			target: null,
			blank: jigsaw.Corner.TR,
			randomize: noop,
			size: 6
		};
		
		// TODO: This is not fully implemented
		var move = function(clicked, game) { 
			var s = game.squares, p = game.pieces, b = game.blank, count, direction;
			
			// get x, y location in array of blank and selected
			var locations = (function(g) {
				var bloc, selected, p = g.pieces;
				for(var row = 0, len = s; row < len; row++){
					for(var col = 0; col < len; col++) {
						var curr = p[row][col];
						if(curr.hasClass('blank')) { bloc = {x: row, y: col }; } 
						if(curr.hasClass('clicked')) { selected = {x: row, y: col }; }						
						if(bloc && selected) {	return { blank: bloc, clicked: selected	}; }
					}
				}
			})(game);
			
			if(locations.blank.y == locations.clicked.y) {
				// located in same row
				count = Math.abs(locations.blank.x - locations.clicked.x);
				direction = (locations.blank.x < locations.clicked.x) ? 'W': 'E';
			} else if(locations.blank.x == locations.clicked.x) {
				// located in same column
				count = Math.abs(locations.blank.y - locations.clicked.y);
				direction = (locations.blank.x < locations.clicked.x) ? 'N': 'S';
			}
			
			// TODO: Animate and shift, then call draw
			if(count) {
				if(jigsaw.Direction[direction]>>1==1){
					// moving E/W
					console.log("moving east/west by " + count);
				} else {
					// moving N/S
					console.log("moving north/south by " + count);
				}
			} else { 
				console.log("no move");
			}
		}
		
		var updatePieces = function(game) { 
			var t = game.target, s = game.squares;
			game.pieces = new Array(s);
			$.each(game.pieces, function(i,v) { 
				game.pieces[i] = new Array();
			});
			var items = $('.jigsaw_piece', t);		
			
			for(var index = 0, size = items.length; index < size; index++) {
				var row = Math.floor(index / s);
				game.pieces[row].push( $(items[index]) );
			}
		}

		var draw = function(game) {	
			var t = game.target, s = game.squares, p = game.pieces;
			t.html('');
			for(var rr = s-1; rr >= 0; rr--) {
				for(var rc = s-1; rc >= 0; rc--) {
					t.append(p[rr][rc]);
				}
			} 
			
			updatePieces(game);
		}

		// TODO: This is not fully implemented
		var validate = function(game) {
			var t = game.target, p = game.pieces, valid = true;			
			for(var rr = s-1; valid && rr >= 0; rr--) {
				for(var rc = s-1; rc >= 0; rc--) {
					// get piece offset from parent
					// validate against background position
				}
			}
			return valid;
		}
		
		var defaultRandomizer = function(game) {
			var t = game.target, p = game.pieces, s = game.squares, blank = game.blank;
			for(var randX = Math.ceil(Math.random() * (s*2)); randX < s && randX > -1; randX--) {					
				for(var randY = Math.ceil(Math.random() * (s*2)); randY < s && randY > -1; randY--){
					var moveX = p[randX][randY];
					var moveY = p[randY][randX];
					if(moveX != blank && moveY != blank) {
						try{
							p[randX][randY] = moveY
							p[randY][randX] = moveX;
						} catch(err) { 
							console.error(err);
						}
					}
				}
			}		
		}
		
		var _blankify = function(game) {
			var blank, 
				pieces = game.pieces
				squares = game.squares
				blankLocation = game.blankLocation; 
				
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
			$(blank).addClass('blank');
			
			return blank;
		}
		
		
		var options = $.extend({ }, settings, opt );

		return this.load(function() { 
			var game, originalImg, 
				width, 
				height, 
				imageSrc, 
				blankLocation = jigsaw.Corner[options.blank], 
				target = options.target,
				squares = options.size, 
				randomize = options.randomize;
							
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
			
			$(originalImg).hide();	
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
					
					pieces[row][column] = piece;					
				}
			}		
			
			game = {
				'target': target,
				'pieces': pieces,
				'squares': squares,
				'blankLocation' : blankLocation
			};
			
			game['blank'] = _blankify.call(this, game);				
			if(randomize) randomize.call(this, game, defaultRandomizer);
			else defaultRandomizer.call(this, game);
			
			draw.call(this, game);
			
			$(game.target).delegate('.jigsaw_piece', 'click', function() {
				var fn = move;
				$('.jigsaw_piece', game.target).removeClass('clicked');
				$(this).addClass('clicked');
				fn.call(jigsaw, this, game);
			});
		});
	};	
		
	// Settings lookup. 1 so jigsaw.Corner[value] || default works
	jigsaw.Corner = { TL: 1, TR: 2, BL: 3, BR: 4 };
	jigsaw.Direction = { N: 2, E: 4, S: 2, W: 4 };
	
	$.fn.jigsaw = jigsaw;
})(jQuery);
