// runs with index.html
// turns list into movie

var masterPause = false;
var masterIndex = 0;
var masterList = [];
var masterTimer = null;
var masterFontcap = true;

const RATIOBIG = 1/6;
const RATIOSMALL = 1/20;

const ANIMATEINTIME = 1;
const ANIMATEOUTTIME = 1;

const OPACITYIN = .1;
const OPACITYOUT = .1;

$(function() {
    $.get("thelist.list", function(data) {
        masterList = JSON.parse(data).scenesflat;
        display();
    });

    $('.pause').click(function() {
        if (masterPause) {
            masterPause = false;
            display();
        } else {
            masterPause = true;
            clearTimeout(masterTimer);
        }
    });

    $('.fontcap').change(function() {
        masterFontcap = !masterFontcap;
        triggerbigtext();
    });

});

//////////////////////////////////////////////////////

function animateOut(nexttypeflat) {
    var newtransform = '';

    if (nexttypeflat === 'sentence') {
        newtransform = 'rotate3d(0, 1, 0, -5deg)';
    } else {
        newtransform = 'rotate3d(1, 0, 0, -5deg)';
    }

    newtransform += ' translate3d(0, 0, 30px)'; // depth

    $('#bigtext').css('-webkit-transition', ANIMATEOUTTIME + 's');
    $('#bigtext').css('transition', ANIMATEOUTTIME + 's');

    $('#bigtext').css('-webkit-transform', newtransform);
    $('#bigtext').css('transform', newtransform);
    $('#bigtext').css('opacity', OPACITYOUT);
}

function animateIn(prevtypeflat) {
    var newtransform = '';

    if (prevtypeflat === 'sentence') {
        newtransform = 'rotate3d(0, 1, 0, 5deg)';
    } else {
        newtransform = 'rotate3d(1, 0, 0, 5deg)';
    }

    newtransform += ' translate3d(0, 0, -30px)'; // depth

    $('#bigtext').css('-webkit-transition', '0s');
    $('#bigtext').css('transition', '0s');

    $('#bigtext').css('-webkit-transform', newtransform);
    $('#bigtext').css('transform', newtransform);
    $('#bigtext').css('opacity', OPACITYIN);

    // need timeout otherwise skips first transformation
    setTimeout(function() {
        $('#bigtext').css('-webkit-transition', ANIMATEINTIME + 's');
        $('#bigtext').css('transition', ANIMATEINTIME + 's');

        $('#bigtext').css('-webkit-transform', 'rotate3d(0, 0, 0, 0deg)');
        $('#bigtext').css('transform', 'rotate3d(0, 0, 0, 0deg)');
        $('#bigtext').css('opacity', 1);
    }, 10);
}

function triggerbigtext() {
    var ratio = masterFontcap ? RATIOSMALL : RATIOBIG;
    $('#bigtext').bigtext({
        maxfontsize: Math.round($(window).height() * ratio),
    });
}

function calcHTMLstring(sceneflat) {
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

    return final;
}

function display() {
    if (masterPause)
        return;
    if (masterIndex === masterList.length)
        return;

    var sceneflat = masterList[masterIndex];
    var typeflat = sceneflat.typeflat;
    var prevsceneflat = masterList[masterIndex-1];
    var prevtypeflat = prevsceneflat ? prevsceneflat.typeflat : null;
    var nextsceneflat = masterList[masterIndex+1];
    var nexttypeflat = nextsceneflat ? nextsceneflat.typeflat : null;

    if (typeflat === 'p' || typeflat === 'pbreak') {
        masterIndex++;
        display();
        return;
    }

    $('#bigtext').empty();
    $('#bigtext').append(calcHTMLstring(sceneflat));
    triggerbigtext();
    animateIn(prevtypeflat);
    masterTimer = setTimeout(function() {

        masterTimer = setTimeout(function() {
            animateOut(nexttypeflat);

            masterTimer = setTimeout(function() {
                masterIndex++;
                display();

            }, ANIMATEOUTTIME * 1000);

        }, masterList[masterIndex].timeflat);

    }, ANIMATEINTIME * 1000);
}
