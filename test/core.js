;(function($) {

module('core');

var usedIds = window['empuzzled_ids'] = { };
var cow = 'https://lh3.googleusercontent.com/-kPX9t1qd23U/TkaPAeb74aI/AAAAAAAAipU/gZQHDbHvWow/s800/IMG_0191.JPG',
    github = 'https://lh3.googleusercontent.com/-IffZP0nWXVU/TkaPJD3cfpI/AAAAAAAAipk/B3vNAWeil20/s800/11%252520-%2525201.jpg',
    jimschubert = 'https://lh3.googleusercontent.com/-KwFpNW9VJr0/TkaPWq1aOTI/AAAAAAAAipo/HqDQ2sclzQQ/s800/header.jpg',
    abdul = 'https://lh5.googleusercontent.com/-Pabae9LaLtE/TkaPfCfGzlI/AAAAAAAAips/WJgYgmmROTM/s800/pwnt.jpg',
    noop = function() { };

test("requirements", function() {
    expect(5);
	ok(Array.prototype.push, "[JavaScript] Array.push() must exist" );
    ok(Function.prototype.call, "[JavaScript] Function.call() must exist");
    ok(jQuery, "[jQuery] jQuery must exist");
    ok($, "[jQuery] $ must exist");
    equal(jQuery, $, "[jQuery] jQuery == $");
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

test('defaults (empty options)', function() {
    expect(4);
    var noOptions = createTest('noOptions', cow, function(img, tgt) {
        return $(img).empuzzle();
    });
    
    ok(noOptions, "[ok] noOptions should not be empty"); 
    ok($(noOptions.returned).attr('src') == cow, 
        "[ok] noOptions.returned should be expected element");
    
    stop();
    $.when($('#noOptions').load()).then(function(img){ 
        start();
        var targ = $('.noOptions').siblings('.empuzzle_target:first');
        
        ok(targ, "[ok] noOptions should append div.empuzzle_target");
        ok($(targ).children().length == 36, 
            "[ok] noOptions target should contain 36 children (default: size = 6)");
        
        $('.empuzzle_target:last').remove();
    });
});

test('target (passing target to options object)', function() {
    expect(5);
    var withTarget = createTest('withTarget', jimschubert, function(img, tgt){
        return $(img).empuzzle({ target: tgt });
    });
    ok(withTarget, "[ok] withTarget should not be empty");
    ok(withTarget.target, "[ok] withTarget.target should not be empty");
    ok(withTarget.returned, "[ok] withTarget.returned should not be empty");
    
    stop();
    $.when($('#withTarget').load()).then(function(img){
        start();
        var targ = $('.withTarget');
        ok(targ.length == 1, "[ok] withTarget.target shouldn't be empty");
        ok($(targ).children().length == 36, 
            "[ok] withTarget.target should contain 36 children (default: size = 6)");
    });
});

test('size (variations from default size = 6)', function() {
    expect(12);
    
    var negatory = createTest('negatory', jimschubert, function(img, tgt) {
        return $(img).empuzzle({ size : -1 });
    });
     
    stop();
    $.when($('#negatory').load()).then(function(img){
        start();
        var targ = $('.negatory').siblings('.empuzzle_target:first');
        ok(targ.length == 1, "[ok] negatory.target shouldn't be empty");
        ok($(targ).children().length == 36, 
            "[ok] negatory.target should contain 36 children using default when invalid size is specified (size = -1)");
        $('.empuzzle_target:last').remove();
    });
    
    var size1 = createTest('size1', jimschubert, function(img, tgt) {
        return $(img).empuzzle({ size : 1 });
    });
     
    stop();
    $.when($('#size1').load()).then(function(img){
        start();
        var targ = $('.size1').siblings('.empuzzle_target:first');
        ok(targ.length == 1, "[ok] size1.target shouldn't be empty");
        ok($(targ).children().length == 1, 
            "[ok] size1.target should contain 1 child... blank (size = 1)");
        $('.empuzzle_target:last').remove();
    });
    
    var size2 = createTest('size2', jimschubert, function(img, tgt) {
        return $(img).empuzzle({ size : 2 });
    });
     
    stop();
    $.when($('#size2').load()).then(function(img){
        start();
        var targ = $('.size2').siblings('.empuzzle_target:first');
        ok(targ.length == 1, "[ok] size2.target shouldn't be empty");
        ok($(targ).children().length == 4, "[ok] size2.target should contain 4 children (size = 2)");
        $('.empuzzle_target:last').remove();
    });
        
    var size3 = createTest('size3', abdul, function(img, tgt) {
        return $(img).empuzzle({ size : 3 });
    });
     
    stop();
    $.when($('#size3').load()).then(function(img){
        start();
        var targ = $('.size3').siblings('.empuzzle_target:first');
        ok(targ.length == 1, "[ok] size3.target shouldn't be empty");
        ok($(targ).children().length == 9, "[ok] size3.target should contain 9 children (size = 3)");
        $('.empuzzle_target:last').remove();
    });
        
    var size4 = createTest('size4', cow, function(img, tgt) {
        return $(img).empuzzle({ size : 4 });
    });
     
    stop();
    $.when($('#size4').load()).then(function(img){
        start();
        var targ = $('.size4').siblings('.empuzzle_target:first');
        ok(targ.length == 1, "[ok] size4.target shouldn't be empty");
        ok($(targ).children().length == 16, "[ok] size4.target should contain 16 children (size = 4)");
        $('.empuzzle_target:last').remove();
    });
    
    var size5 = createTest('size5', cow, function(img, tgt) {
        return $(img).empuzzle({ size : 5 });
    });
     
    stop();
    $.when($('#size5').load()).then(function(img){
        start();
        var targ = $('.size5').siblings('.empuzzle_target:first');
        ok(targ.length == 1, "[ok] size5.target shouldn't be empty");
        ok($(targ).children().length == 25, "[ok] size5.target should contain 16 children (size = 5)");
        $('.empuzzle_target:last').remove();
    });
});

test('pseudo-teardown (no real tests)', function() {
    expect(1);    
    // Comment out this line if you want to see results of all tests.
    // $('#test_target').html('');    
    ok(1);
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
        tgt = $('<div class="'+ testName +'"></div>'),
        tested = { },
        returned = (function() {   
            var fixture = $('#test_target');    
            var r = runner.call(this, img, tgt);
            var container = $('<div></div>');
            container.append('<h2>'+testName+'</h2>');
            container.append(tgt);
            tgt.before(img);
            fixture.append(container);
            return r;
        })();
    
    tested['image'] = img;
    tested['target'] = tgt;
    tested['returned'] = returned;
    return tested;
};

})(jQuery);
