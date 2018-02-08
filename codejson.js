// node codejson.js
// turns json into list

var fs = require('fs');
var text = fs.readFileSync('thejson.json').toString();

var m = JSON.parse(text);
var mf = new MovieFlat();

for (var i in m.scenes) {
    var scene = m.scenes[i];

    if (scene.type !== 'p') {                           // if not paragraph
        mf.add(new SceneFlat(1000, scene.type, [scene.content]));
    } else {                                            // else if paragraph
        mf.add(new SceneFlat(100, scene.type, ['']));   // push <p> beginning

        var content = scene.content;                    // push <p> content
        for (var j in content) {
            mf.add(new SceneFlat(1000, content[j].type, splitIntoRows(content[j])));
        }
    }
}

mf.add(new SceneFlat(2000, 'fadetoblack', ['']));

fs.writeFile("./public/thelist.list", JSON.stringify(mf, null, 4));



//////////////////////////////////////////////////////////////

function splitIntoRows(contentElement) {
    var line = contentElement.content;
    return [line];
    // if (contentJ.length < 20) {
    //     contentJarray.push(contentJ);
    // } else if (contentJ.length < 40) {
    //
    // } else if (contentJ.length <)
    //
    // // split into rows for display heree
    // // here use more advanced logic for splitting
    //     // number of words
    //     // commas, periods
    //     // parts of speech
    //     // if ," or dash
    //
    // var kInit Kend
    // for (var k = 0; k < contentJ.length; k++) {
    //     if (//look for space)
    //
    //
    // }
    // // var doc = nlp(contentJ);
    // contentJarray[0] = contentJ.substring(0, 20);
    // contentJarray[1] = contentJ.substring(20, 100);

}

function MovieFlat() {
    this.scenesflat = [];

    this.add = function(sceneflat) {
        this.scenesflat.push(sceneflat);
    }
}

function SceneFlat(timeflat, typeflat, contentflat) {
    this.timeflat = timeflat;
    this.typeflat = typeflat;
    this.contentflat = contentflat;
}
