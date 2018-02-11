// runs with index.html
// turns list into movie

var masterPause = false;
var masterIndex = 0;
var masterList = [];
var masterTimer = null;
var masterFontcap = true;
var masterSpeedup = 1.2;

const ORIGINANIMATEINTIME = 1; // in seconds
const ORIGINAANIMATEOUTTIME = 1;
var masterAnimateInTime = ORIGINANIMATEINTIME * masterSpeedup;
var masterAnimateOutTime = ORIGINAANIMATEOUTTIME * masterSpeedup;

const RATIOBIG = 1/6;
const RATIOSMALL = 1/20;

const OPACITYIN = .5;
const OPACITYOUT = .5;

const CONTROLSVISIBLE = 5000;

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
    } else {
        $.get("thelist.list", initapp);
    }

    function initapp(data) {
        masterList = JSON.parse(data).scenesflat;
        display();
    }

    // similar code at "replay5" and "forward5" and "pause"
    $(document).keydown(function(e) {
        if (e.which === 37) {         // left
            clearTimeout(masterTimer);
            masterIndex--;
            masterIndex = Math.max(masterIndex, 0);
            display();
        }
        else if (e.which === 39) {    // right
            clearTimeout(masterTimer);
            masterIndex++;
            masterIndex = Math.min(masterIndex, masterList.length);
            display();
        } else if (e.which === 32) {   // space
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
    });

    var controlshtml =
    // ' <p style="width:300px">'+
    // '     <input class="mdl-slider mdl-js-slider" type="range" id="progress"'+
    // '     min=".5" max="2" value="1" step=".05">'+
    // ' </p>'+

    ' <label class="mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect">'+
    '   <input type="button" class="replay5 mdl-icon-toggle__input">'+
    '   <i class="mdl-icon-toggle__label material-icons">replay_5</i>'+
    ' </label>'+

    ' <label class="mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect">'+
    '   <input type="checkbox" class="pauseinput mdl-icon-toggle__input">'+
    '   <i class="playicon mdl-icon-toggle__label material-icons">pause_circle_filled</i>'+
    ' </label>'+

    ' <label class="mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect">'+
    '   <input type="button" class="forward5 mdl-icon-toggle__input">'+
    '   <i class="mdl-icon-toggle__label material-icons">forward_5</i>'+
    ' </label>'+

    ' <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect">'+
    '   <input type="checkbox" class="fontcap mdl-switch__input" checked>'+
    ' </label>'+

    ' <p style="width:200px">'+
    '     <input class="mdl-slider mdl-js-slider" type="range" id="slider"'+
    '     min=".5" max="2" value=".83" step=".05">'+
    ' </p>'
    ;


    // all jquery controls of buttons must come after this instantiation
    var controls = $.toast({
      text: controlshtml,
      showHideTransition: 'fade',
      bgColor: '#eee',
      textColor: '#222',
      allowToastClose: false,
      hideAfter: CONTROLSVISIBLE,
      stack: false,
      textAlign: 'center',
      position: 'bottom-center',
      loader: false
    })

    $('.fontcap').change(function() {
        masterFontcap = !masterFontcap;
        triggerbigtext();
    });

    $('.pauseinput').click(function() {
        if (masterPause) {
            $('.playicon').html('pause_circle_filled');
            masterPause = false;
            display();
        } else {
            $('.playicon').html('play_circle_filled');
            masterPause = true;
            clearTimeout(masterTimer);
        }
    });

    $('.replay5').click(function() {
        clearTimeout(masterTimer);
        masterIndex -=5;
        masterIndex = Math.max(masterIndex, 0);
        display();
    });

    $('.forward5').click(function() {
        clearTimeout(masterTimer);
        masterIndex +=5;
        masterIndex = Math.min(masterIndex, masterList.length);
        display();
    });

    $('#slider').on('input', function () {
        masterSpeedup = 1 / $(this).val();

        masterAnimateInTime = ORIGINANIMATEINTIME * masterSpeedup;
        masterAnimateOutTime = ORIGINAANIMATEOUTTIME * masterSpeedup;
    });

    var mousemute = true;
    setTimeout(function() { mousemute = false; }, CONTROLSVISIBLE);
    $("#grandparent").mousemove(function(event) {
        if (mousemute)
            return;

        mousemute = true;
        controls.reappear();
        setTimeout(function() { mousemute = false; }, CONTROLSVISIBLE);
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
