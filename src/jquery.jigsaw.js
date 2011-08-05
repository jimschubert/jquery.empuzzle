;
// jquery.jigsaw is based on the 'Jigsy' javascript puzzle on Cityposh.com.
// I really enjoy the game, and I thought I'd try out some code for creating a similar game.
(function($) { 
	
	$.extend($.expr[":"], { 
		 getPiece: function (current, index, metadata, elements) {
			if(metadata && metadata.length == 4) return $(current).attr('puzzle_id') == metadata[3];	
			return null;
		}
	});
	
	// opt:
	// 	win: function(pieces) { }
	//  target: element
	//  blank: 'TL'|'TR'|'BL'|'BR'
	//  randomize: function(pieces, defaultFunction) { }
	var jigsaw = function(opt) {
		var noop = function() { };
		
		var settings = { 
			win: noop,
			target: $('.jigsaw_piece:first').parent(),
			blank: jigsaw.Corner.TR,
			randomize: noop,
			size: 6
		};
		
		// TODO: This is not fully implemented
		var move = function(clicked, game, cb) { 
			var  g = game, s = g.squares, p = g.pieces, b = g.blank, count, direction, width, height, cid, bid,
				animateOptions = { duration: 500 };	
			width = $(clicked).width();
			height = $(clicked).height();
			cid = $(clicked).attr('puzzle_id');
			bid = $(b).attr('puzzle_id');
			
			animateOptions = $.extend(animateOptions, g.anim);
			
			// get x, y location in array of blank and selected
			var locations = (function(p) {
				var bloc, selected;
				for(var row = 0, len = s; row < len; row++){
					for(var col = 0; col < len; col++) {
						var curr = p[row][col];
						if( $(curr).attr('puzzle_id') == bid ) { bloc = {x: col, y: row }; } 
						if( $(curr).attr('puzzle_id') == cid ) { selected = {x: col, y: row }; }						
						if(bloc && selected) {	return { 
								blank: bloc, 
								clicked: selected
							}; 
						}
					}
				}
				return { blank: bloc, clicked: selected	}; 
			})(p);
			
			if(!locations || !locations.blank || !locations.clicked) return; // double-click can cause this.
			
			if(locations.blank.y == locations.clicked.y) {
				// located in same row
				count = Math.abs(locations.blank.x - locations.clicked.x);
				direction = (locations.blank.x < locations.clicked.x) ? 'W': 'E';
			} else if(locations.blank.x == locations.clicked.x) {
				// located in same column
				count = Math.abs(locations.blank.y - locations.clicked.y);
				direction = (locations.blank.y < locations.clicked.y) ? 'N': 'S';
			}

			if(count) {
				var animations = count+1, 
					onComplete = function() {
						animations--; 
						if(animations <= 0) {
							console.log("drawing.");
							draw(g);
							validate(g);
						}
					},
					lc = locations.clicked, 
					lastX, 
					lastY,
					animatePiece = { },
					animateBlank = { };
					
					animateOptions.queue = false;
					var wrap = animateOptions.complete;
					animateOptions.complete =  function() {
										onComplete();
										if(typeof wrap === "function")
											wrap.apply(this, arguments);
									};
				
				if(jigsaw.Direction[direction]>>1==1){
					var row = lc.y, 
						bsquare = locations.blank.x,
						tmpId;
					if(direction == 'E'){
						animatePiece['left'] = '+=' + width;
						animateBlank['left'] = '-=' + (width*count);
						
						for(var column = lc.x; column < bsquare; column++) {															
							
							var id = tmpId || $(p[row][column]).attr('puzzle_id');
							var piece = $(':getPiece('+ id +')', target).stop().animate(animatePiece,animateOptions);
								
							tmpId = piece.next(':not(.blank)').attr('puzzle_id') || tmpId;
							
							p[row][column+1] = piece;
							piece.removeClass('clicked');
							
						}		
						
					} else {
						animatePiece['left'] = '-=' + width;
						animateBlank['left'] = '+=' + (width*count);
						for(var column = lc.x; column > bsquare; column--) {
							var id = tmpId || $(p[row][column]).attr('puzzle_id');
							var piece = $(':getPiece('+ id +')', target).stop().animate(animatePiece,animateOptions);
							
							tmpId = piece.prev(':not(.blank)').attr('puzzle_id') || tmpId;
							
							p[row][column-1] = piece;
							piece.removeClass('clicked');
						}
					}
					var movedBlank = $(':getPiece('+ bid +')', target).stop().animate(animateBlank, { 
							duration: animateOptions.duration,
							queue: false,
							complete: function() {					
								p[row][lc.x] = $(this); // set blank piece in array.
								game.blank = this; // update holder with current positioned blank
								onComplete();
							}
						});
					
				} else {
					if(direction == 'N'){
						animatePiece['top'] = '-=' + height;
						animateBlank['top'] = '+=' + (height*count);
					} else {
						animatePiece['top'] = '+=' + height;
						animateBlank['top'] = '-=' + (height*count);
					}
				}		
			} else { 
				console && (typeof console.log === "function") && console.log("no move");
			}
		}
		
		var updatePieces = function(game) { 
			var t = game.target, s = game.squares;
			game.pieces = new Array(s);
			$.each(game.pieces, function(i,v) { 
				game.pieces[i] = new Array();
			});
			var items = $('.jigsaw_piece', t);	
			for(var index = 0, size = items.length ; index < size; index++) {
				var row = Math.floor(index / s);
				game.pieces[row].push( $(items[index]) );
			}
		}

		var draw = function(game) {	
			var t = game.target, s = game.squares-1, p = game.pieces;
			t.html('');
			console.log(p);
			for(var rr = 0; rr <= s; rr++) {
				for(var rc = 0; rc <= s; rc++) {
					t.append(p[rr][rc]);
				}
			} 
			updatePieces(game);
		}

		var validate = function(game) {
			var p = game.pieces, 
				v = game.validator, 
				win = game.onWin, 
				s = game.squares,
				err = false;	
				
			for(var row = 0; row < s; row++ ){
				for(var column = 0; column < s; column++) {
					var currentId = $(p[row][column]).attr('puzzle_id');
					var want = v[row+column];
					if(currentId !== want) { err = true };
				}
			}
			if(!err) win.call(this);
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
			$(blank).html('<span></span>');
			return blank;
		}
		
		
		var options = $.extend({ }, settings, opt );

		return this.load(function() { 
			var game, originalImg, 
				width, 
				height, 
				imageSrc, 
				offset,
				blankLocation = jigsaw.Corner[options.blank], 
				target = options.target,
				squares = options.size, 
				randomize = options.randomize, validator = [];
							
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
			offset = $(target).offset();
			
			// setup board
			var pieces = new Array();
			for(var row = 0, len = squares; row < len; row++) {
				pieces.push(new Array(squares));
				for(var column = 0, sizeW = width/squares, sizeH = height/squares ;column < len; column++) {
					// create divs, displacing background
					var piece = $('<div class="jigsaw_piece"></div>');
					piece.css({ 
						// 'float' : 'left',
						'position' : 'absolute',	
						'background': ('url(\'' + imageSrc + '\') ' + (sizeW * row) + ' ' + (sizeH * column) ),
						'height': sizeH + 'px',
						'width': sizeW + 'px',
						'cursor': 'pointer',
						'top' : ( ( row * sizeH ) + offset.top ),
						'left' : ( ( column * sizeW ) + offset.left )
					});
					var id = Math.random();
					validator.push(id);
					piece.attr('puzzle_id', id);					
					pieces[row][column] = piece;					
				}
			}		
			
			game = {
				'target': target,
				'pieces': pieces,
				'squares': squares,
				'blankLocation' : blankLocation,
				'validator' : validator,
				'onWin' : options.win,
				'anim' : options.animateOptions || {}
			};
			
			game['blank'] = _blankify.call(this, game);				
			if(randomize) randomize.call(this, game, defaultRandomizer);
			else defaultRandomizer.call(this, game);			
			
			$('.jigsaw_piece', game.target).live('click', function() {
				var fn = move;
				$('.jigsaw_piece').removeClass('clicked'); 
				$(this).addClass('clicked');
				fn.call(jigsaw, this, game);				
			});
			
			draw.call(this, game); // This sets things off
		});
	};	
		
	// Settings lookup. 1 so jigsaw.Corner[value] || default works
	jigsaw.Corner = { TL: 1, TR: 2, BL: 3, BR: 4 };
	jigsaw.Direction = { N: 4, E: 2, S: 4, W: 2 };
	
	$.fn.jigsaw = jigsaw;
})(jQuery);
