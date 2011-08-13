;(function($) {

module('core', {
   
});

var usedIds = window['empuzzled_ids'] = { };
var cow = 'https://lh3.googleusercontent.com/-kPX9t1qd23U/TkaPAeb74aI/AAAAAAAAipU/gZQHDbHvWow/s800/IMG_0191.JPG',
    github = 'https://lh3.googleusercontent.com/-IffZP0nWXVU/TkaPJD3cfpI/AAAAAAAAipk/B3vNAWeil20/s800/11%252520-%2525201.jpg',
    jimschubert = 'https://lh3.googleusercontent.com/-KwFpNW9VJr0/TkaPWq1aOTI/AAAAAAAAipo/HqDQ2sclzQQ/s800/header.jpg',
    abdul = 'https://lh5.googleusercontent.com/-Pabae9LaLtE/TkaPfCfGzlI/AAAAAAAAips/WJgYgmmROTM/s800/pwnt.jpg',
    noop = function() { };

test("requirements", function() {
    expect(4);
	ok(Array.prototype.push, "Array.push()" );
    ok(Function.prototype.call, 'Function.call()');
    ok(jQuery, 'jQuery');
    ok($, '$');
});

// Make sure the utility function performs as expected
test("utility - createTest", function() {
    expect(15);
    
    // Test errors.
    raises(function() { createTest(null); }, 
        "[raises] testName should not be nullable");
    raises(function() { createTest(''); },
        "[raises] testName should require length > 0");
    raises(function() { createTest('asdf!asdf'); }, 
        "[raises] testName should not allow invalid element id");
    
    raises(function() { createTest('asdf', null); }, 
        "[raises] imgSrc should not be nullable");
    raises(function() { createTest('asdf', ''); }, 
        "[raises] imgSrc should require length > 0");
    
    raises(function() { createTest('asdf', jimschubert, null); }, 
        "[raises] runner should not be nullable");
    raises(function() { createTest('asdf', jimschubert, 'asdf'); }, 
        "[raises] runner should be required to be a function");
    
    var utilityTest = createTest('asdf', jimschubert, function() { return noop; });
    ok(utilityTest, 
        "[ok] utilityTest should not be empty");
    ok(usedIds['asdf'], 
        "[ok] global empuzzled_ids test element should include 'asdf' element");
    
    ok(utilityTest.image, 
        "[ok] utilityTest.image should not be empty");
    ok(utilityTest.image instanceof jQuery, 
        "[ok] utilityTest.image should be a jQuery object");
    
    ok(utilityTest.target, 
        "[ok] utilityTest.target should not be empty");
    ok(utilityTest.target instanceof jQuery, 
        "[ok] utilityTest.target should be a jQuery object");
    
    ok(utilityTest.returned, 
        "[ok] utilityTest.returned should not be empty");
    equals(utilityTest.returned, noop, 
        "[equals] utilityTest.returned should return noop function reference");
    
    usedIds['asdf'] = 0;
});

test('defaults', function() {
    expect(5);
    var noOptions = createTest('noOptions', cow, function(img, tgt) {
        return $(img).empuzzle();
    });
    
    ok(noOptions, "[ok] noOptions should not be empty"); 
    ok($(noOptions.returned).attr('src') == cow, 
        "[ok] noOptions.returned should be expected element");
    
    var withTarget = createTest('withTarget', jimschubert, function(img, tgt){
        return $(img).empuzzle({ target: tgt });
    });
    ok(withTarget, "[ok] withTarget should not be empty");
    ok(withTarget.target, "[ok] withTarget.target should not be empty");
    ok(withTarget.returned, "[ok] withTarget.returned should not be empty");
    
});

var createTest = function(testName, imgSrc, runner) {
    if(typeof testName !== "string" || testName.length <= 0 || !testName.match(/[a-z\-_]/gi)) {
        throw Error("First parameter to createTest is required to be a string and valid HTML element id");
    }
    if(typeof imgSrc !== "string" || imgSrc.length <= 0) {
        throw Error("Second parameter to createTest is required to be a string referring to the image src");
    }
    if(typeof runner !== "function") { 
        throw Error("Third parameter to createTest is required to be a function");
    }
    if(usedIds[testName]){ 
        throw Error( testName + ' has been used in another test. Select a unique element id for the testName parameter.'); 
    } else { 
        usedIds[testName] = 1; 
    }
    
    var img = $('<img id="'+ testName +'" src="'+ imgSrc +'" />'),
        tgt = $('<div id="'+ testName +'"></div>'),
        tested = { },
        returned = (function() {   
            var fixture = $('#test_target');    
            var r = runner.call(this, img, tgt);
            fixture.append('<h2>'+testName+'</h2>');
            fixture.append(tgt);
            fixture.append(img);
            return r;
        })();
    
    tested['image'] = img;
    tested['target'] = tgt;
    tested['returned'] = returned;
    return tested;
};

})(jQuery);
