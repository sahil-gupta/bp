// runs with index.html
// turns list into movie

var masterPause = false;
var masterIndex = 0;
var masterList = [];
var masterTimer = null;
var masterFontcap = false;
var masterSpeedup = 1.2;

const ORIGINANIMATEINTIME = 1; // in seconds
const ORIGINAANIMATEOUTTIME = 1;
var masterAnimateInTime = ORIGINANIMATEINTIME * masterSpeedup;
var masterAnimateOutTime = ORIGINAANIMATEOUTTIME * masterSpeedup;

const RATIOBIG = 1/10;
const RATIOSMALL = 1/20;

const OPACITYIN = .1;
const OPACITYOUT = .1;

const CONTROLSVISIBLE = 3000;

$(function() {
    // heree customize for friends
    if (window.location.href.includes('zach')) {
        $.get("zach.list", initapp);
    } else if (window.location.href.includes('phil')) {
        $.get("dfw.list", initapp);
    } else if (window.location.href.includes('poem')) {
        $.get("poem.list", initapp);
    } else if (window.location.href.includes('john')) {
        $.get("dfw.list", initapp);
    } else if (window.location.href.includes('sam')) {
        $.get("thelist.list", initapp);
    } else if (window.location.href.includes('noah')) {
        $.get("lincoln.list", initapp);
    } else if (window.location.href.includes('shreyas')) {
        $.get("tagore.list", initapp);
    } else if (window.location.href.includes('guavocado')) {
        $.get("bananafish.list", initapp);
    } else if (window.location.href.includes('avalon')) {
        $.get("avalon.list", initapp);
    } else {
        $.get("thelist.list", initapp);
    }

    function initapp(data) {
        masterList = JSON.parse(data).scenesflat;
        display();
    }

    function moveIndex(n) {
        clearTimeout(masterTimer);
        masterIndex += n;
        if (n < 0) {    // rewind
            masterIndex = Math.max(masterIndex, 0);
        } else {        // fastforward
            masterIndex = Math.min(masterIndex, masterList.length);
        }
        display();
    }

    function hitPause() {
        if (masterPause) {
            $('.playicon').html('pause_circle_filled');
            masterPause = false;
            display();
        } else {
            $('.playicon').html('play_circle_filled');
            masterPause = true;
            clearTimeout(masterTimer);
        }
    }

    // similar code at "replay5" and "forward5" and "pause"
    $(document).keydown(function(e) {
        if (e.which === 37) {           // left
            moveIndex(-1);
        }
        else if (e.which === 39) {      // right
            moveIndex(1);
        } else if (e.which === 32) {    // space
            hitPause();
        }
    });

    $('.pauseinput').click(function() { hitPause(); });
    $('.replay5').click(function() { moveIndex(-5); });
    $('.forward5').click(function() { moveIndex(5); });
    $('.fontcap').change(function() {
        masterFontcap = !masterFontcap;
        triggerbigtext();
    });
    $('#slider').on('input', function () {
        masterSpeedup = 1 / $(this).val();

        masterAnimateInTime = ORIGINANIMATEINTIME * masterSpeedup;
        masterAnimateOutTime = ORIGINAANIMATEOUTTIME * masterSpeedup;
    });

    // handling snackbar
    var mousemute = false;
    setTimeout(() => { $('.snackbar').fadeTo(500, 0); }, CONTROLSVISIBLE);
    $('body').mousemove(function(event) {
        if (mousemute)
            return;
        mousemute = true;

        $('.snackbar').fadeTo(250, 1);

        setTimeout(() => { $('.snackbar').fadeTo(500, 0); }, CONTROLSVISIBLE);
        setTimeout(() => { mousemute = false; }, CONTROLSVISIBLE);
    });
});

//////////////////////////////////////////////////////

function animateOut(nexttypeflat) {
    var newtransform = '';

    if (nexttypeflat === 'sentence') {
        newtransform = 'rotate3d(0, 1, 0, -2deg)';
    } else {
        newtransform = 'rotate3d(1, 0, 0, -2deg)';
    }

    newtransform += ' translate3d(0, 0, 10px)'; // depth

    $('#bigtext').css('transition-duration', masterAnimateOutTime + 's');

    $('#bigtext').css('-webkit-transform', newtransform);
    $('#bigtext').css('transform', newtransform);
    $('#bigtext').css('opacity', OPACITYOUT);
}

function animateIn(prevtypeflat) {
    var newtransform = '';

    if (prevtypeflat === 'sentence') {
        newtransform = 'rotate3d(0, 1, 0, 2deg)';
    } else {
        newtransform = 'rotate3d(1, 0, 0, 2deg)';
    }

    newtransform += ' translate3d(0, 0, -10px)'; // depth

    $('#bigtext').css('transition-duration', '0s');

    $('#bigtext').css('-webkit-transform', newtransform);
    $('#bigtext').css('transform', newtransform);
    $('#bigtext').css('opacity', OPACITYIN);

    // need timeout otherwise skips first transformation
    setTimeout(function() {
        $('#bigtext').css('transition-duration', masterAnimateInTime + 's');

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
    // if (masterPause)
        // return;
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
            // check here and not at init of display()
            // because user may have replayed/forwarded5
            if (masterPause)
                return;

            animateOut(nexttypeflat);

            masterTimer = setTimeout(function() {
                masterIndex++;
                display();

            }, masterAnimateOutTime * 1000);

        }, masterList[masterIndex].timeflat * masterSpeedup);

    }, masterAnimateInTime * 1000);
}
