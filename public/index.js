// runs with index.html
// turns list into movie

$(function() {
    $('#bigtext').bigtext({
        maxfontsize: $(window).height() / 8,
        minfontsize: $(window).height() / 32
    });

    $.get("thelist.list", function(data) {
        var thelist = JSON.parse(data).scenesflat;
        display(thelist, 0);

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

});

function display(thelist, playindex) {
    if (playindex === thelist.length)
        return;


    // heree consider the .typeflat as well as animations


    var final = thelist[playindex].contentflat
                .map(row => ('<span>' + row + '</span>'))
                .join(' ');
    $('#bigtext').empty().append(final);

    $('#bigtext').bigtext({
        maxfontsize: $(window).height() / 8,
        minfontsize: $(window).height() / 32
    });

    var delay = thelist[playindex].timeflat;

    setTimeout(display.bind(null, thelist, playindex+1), delay);
}
