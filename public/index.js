// runs with index.html
// turns list into movie

const FONTMAX = 1/8;
const FONTMIN = 1/32;

var masterPause = false;
var masterIndex = 0;
var masterList = [];
var masterTimer = null;

$(function() {
    $('#bigtext').bigtext({
        maxfontsize: Math.round($(window).height() * FONTMAX),
        minfontsize: Math.round($(window).height() * FONTMIN)
    });

    $.get("thelist.list", function(data) {
        masterList = JSON.parse(data).scenesflat;
        display();
    });

    $(".rotation").click(function() {
        var a = Math.round(Math.random() * 20 - 10);
        var x = Math.round(Math.random());
        var y = Math.round(Math.random());
        var z = 0; //Math.round(Math.random());
        var newtransform = 'rotate3d('+x+','+y+','+z+','+a+'deg)';
        $('#bigtext').css('-webkit-transform', newtransform);
        $('#bigtext').css('transform', newtransform);
    });

    $(".transformation").click(function() {
        var existingtransform = $('#bigtext').css('transform') || '';
        var x = 0; //Math.round(Math.random() * 50 - 25);
        var y = 0; //Math.round(Math.random() * 50 - 25);
        var z = Math.round(Math.random() * 80 - 40);
        var newtransform = existingtransform+' '+'translate3d('+x+'px,'+y+'px,'+z+'px)';
        console.log(newtransform)
        $('#bigtext').css('-webkit-transform', newtransform);
        $('#bigtext').css('transform', newtransform);
    });

    $(".pause").click(function() {
        if (masterPause) {
            masterPause = false;
            masterIndex--; // rewind a scene
            display();
        } else {
            masterPause = true;
            clearTimeout(masterTimer);
        }
    });

});

function display() {
    if (masterPause)
        return;
    if (masterIndex === masterList.length)
        return;

    // heree consider the .typeflat as well as animations

    var sceneflat = masterList[masterIndex];
    var final = '';

    if (sceneflat.typeflat === 'sentence') {
        final = sceneflat.contentflat
                .map(row => ('<span>' + row + '</span>'))
                .join(' ');
    } else {
        final = sceneflat.contentflat
                .map(row => ('<span class="bold">' + row + '</span>'))
                .join(' ');
    }

    $('#bigtext').empty().append(final);
    $('#bigtext').bigtext({
        maxfontsize: Math.round($(window).height() * FONTMAX),
        minfontsize: Math.round($(window).height() * FONTMIN)
    });

    var delay = masterList[masterIndex].timeflat;
    masterIndex++;
    masterTimer = setTimeout(display, delay);
}
