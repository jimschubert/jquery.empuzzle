_note: animation and moving of squares is not yet implemented_

# jquery.jigsaw

Playing 'Jigsy' over at cityposh.com is pretty fun.  I received a few JavaScript errors in Google Chrome, so naturally I wanted to write my own jigsaw plugin.

jquery.jigsaw is that plugin.

# Usage

I'm going to try to keep the options as simple as possible.  Here is an example.

	$('#myOriginalImage').jigsaw({
   		size: 6,
   		target: $('#target'), 
   		blank: 'BR'
	});

# .jigsaw( options )

options available are:

*size* : `[Integer]`  
*win* : `function(pieces) { }`  
*target* : `[element]`  
*blank* : `['TL'|'TR'|'BL'|'BR']`  
*randomize* : `function(pieces, defaultFunction) { }`  

An example of how to specify these options:

	var options = { 
        size: 6, 
        blank: 'TR', 
        win: myValidation /* function reference */ 
    };

# License

jquery.jigsaw is released under the MIT License.

	Copyright (c) 2011 James Schubert

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
# Donate!

Help me avoid becoming poor.

[![Donate](http://pledgie.com/campaigns/15784.png)](http://pledgie.com/campaigns/15784)

