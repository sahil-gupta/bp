// runs with index.html
// turns list into movie

var masterPause = false;
var masterIndex = 0;
var masterList = [];
var masterTimer = null;
var masterFontcap = true;
var masterSpeedup = 1;

const ORIGINANIMATEINTIME = 1; // in seconds
const ORIGINAANIMATEOUTTIME = 1;
var masterAnimateInTime = ORIGINANIMATEINTIME;
var masterAnimateOutTime = ORIGINAANIMATEOUTTIME;

const RATIOBIG = 1/6;
const RATIOSMALL = 1/20;

const OPACITYIN = 0;
const OPACITYOUT = 0;

const CONTROLSVISIBLE = 5000;

$(function() {
    $.get("thelist.list", function(data) {
        masterList = JSON.parse(data).scenesflat;
        display();
    });

    var controlshtml =
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
    '     min=".5" max="2" value="1" step=".05">'+
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
        newtransform = 'rotate3d(0, 1, 0, -5deg)';
    } else {
        newtransform = 'rotate3d(1, 0, 0, -5deg)';
    }

    newtransform += ' translate3d(0, 0, 30px)'; // depth

    $('#bigtext').css('-webkit-transition', masterAnimateOutTime + 's');
    $('#bigtext').css('transition', masterAnimateOutTime + 's');

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
        $('#bigtext').css('-webkit-transition', masterAnimateInTime + 's');
        $('#bigtext').css('transition', masterAnimateInTime + 's');

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
