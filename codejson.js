// node codejson.js
// turns json into list

var fs = require('fs');
var syllable = require('syllable');
var text = fs.readFileSync('thejson.json').toString();

var m = JSON.parse(text);
var mf = new MovieFlat();

for (var i in m.scenes) {
    var scene = m.scenes[i];

    if (scene.type !== 'p') {                           // if not paragraph
        var time = 1000;
        mf.add(new SceneFlat(time, scene.type, [scene.content]));
    } else {                                            // else if paragraph
        var time = 100;
        mf.add(new SceneFlat(time, scene.type));         // push <p> beginning

        var content = scene.content;                    // push <p> content
        for (var j in content) {
            var time = calcContentTime(content[j].content);
            var rows = splitIntoRows(content[j].content);
            mf.add(new SceneFlat(time, content[j].type, rows));
        }
    }
}

var time = 2000;
mf.add(new SceneFlat(time, 'fadetoblack'));

fs.writeFile("./public/thelist.list", JSON.stringify(mf, null, 4));

//////////////////////////////////////////////////////////////

// calculates time based on syllables
// minimum time is 1 second
function calcContentTime(content) {
    const MILLISECONDSPERSYLLABLE = 150;
    return Math.max(150 * syllable(content), 1000);
}

// if arr is [a,b,c,d]
// then output = a^2 + (b-a)^2 + (c-b)^2 +(d-c)^2
function calcSumSquareDiffs(arr) {
    var sum = Math.pow(arr[0], 2);
    for (var i = 1; i < arr.length; i++) {
        var diff = arr[i] - arr[i-1];
        sum += Math.pow(diff, 2);
    }
    return sum;
}

function combinations(arr, k){
    var final = [], sub, next;
    for (var i = 0; i < arr.length; i++) {
        if (k === 1) {
            final.push([arr[i]]);
        } else {
            sub = combinations(arr.slice(i+1, arr.length), k-1);
            for (var j = 0; j < sub.length; j++) {
                next = sub[j];
                next.unshift(arr[i]);
                final.push(next);
            }
        }
    }
    return final;
}

// goal: space out the indices
// method: minimize square distances between them
function chooseIndices(indices, nRows) {
    // ignore last index. then add back.
    var indicesTemp = indices.slice();
    var saved = indicesTemp.pop();
    var combosTemp = combinations(indicesTemp, nRows-1);
    var combos = combosTemp.map(arr => arr.concat([saved]));

    var bestScore = 999999;
    var bestIndices = [];
    for (var i = 0; i < combos.length; i++) {
        var score = calcSumSquareDiffs(combos[i]);
        if (score < bestScore) {
            bestScore = score;
            bestIndices = combos[i].slice();
        }
    }

    return bestIndices;
}

function sortAndUnique(a) {
    return Array.from(new Set(a)).sort((a,b) => a-b);
}

function indicesOf(string, word) {
    var indices = [];
    for (var i = 0; i < string.length; i++) {
        if (string.substr(i, word.length) === word)
            indices.push(i);
    }
    return indices;
}

// all these indices are at a ' '
// and the last index is the end of the string
function getPauseIndices(content, nRows) {
    var indices = [];

    // check special chars
    var temp1 = indicesOf(content, ',” ').map(x => x+2);
    var temp2 = indicesOf(content, ' — ').map(x => x+2);
    var temp3 = indicesOf(content, ' “').map(x => x+0);
    var temp4 = indicesOf(content, ': ').map(x => x+1);
    var temp5 = indicesOf(content, ', ').map(x => x+1);
    var temp6 = indicesOf(content, '; ').map(x => x+1);
    indices = indices.concat(temp1,temp2,temp3,temp4,temp5,temp6);

    // check prepositions
    var preps = ['about','above','according','across','after','against','along',
    'among','around','at','because','before','behind','below','beneath',
    'beside','besides','between','beyond','by','concerning','despite','down',
    'during','except','for','from','in','inside','instead','into','like',
    'near','of','off','on','onto','out','outside','over','past','regarding',
    'since','through','throughout','till','to','toward','under','underneath',
    'until','up','upon','with','within','without'];
    for (var j = 0; j < preps.length; j++) {
        var prep = ' ' + preps[j] + ' '; // surround with spaces
        var tempprep = indicesOf(content, prep);
        indices = indices.concat(tempprep);
    }

    // check extra words
    var extras = ['all','as','if','so','that','what','when','which','who',
                    'could','would','should',
                    'only','than'];
    for (var jj = 0; jj < preps.length; jj++) {
        var extra = ' ' + extras[jj] + ' '; // surround with spaces
        var tempextra = indicesOf(content, extra);
        indices = indices.concat(tempextra);
    }

    // check end of string
    indices.push(content.length)

    // remove duplicate and early indices
    const TOOEARLY = 5;
    indices = sortAndUnique(indices).filter(x => x > TOOEARLY);

    // if too few, then add all the spaces between words
    if (indices.length < nRows) {
        var tempspace = indicesOf(content, ' ');
        indices = indices.concat(tempspace);
        indices = sortAndUnique(indices).filter(x => x > TOOEARLY);
    }

    return indices;
}

function splitIntoRows(content) {
    // console.log('---\n'+content);

    const IDEALCHARS = 50;
    var nRows = Math.ceil(content.length / IDEALCHARS);

    // if it fits on one row, just show it
    if (nRows === 1)
        return [content];

    // if more than 1 row
    var iPauses = getPauseIndices(content, nRows);
    var iPausesBest = chooseIndices(iPauses, nRows);

    var iStart = 0;
    var rows = [];
    for (var j = 0; j < iPausesBest.length; j++) {
        var iEnd = iPausesBest[j];
        rows.push(content.slice(iStart, iEnd));
        iStart = iEnd + 1;
    }

    return rows;
}

//////////////////////////////////////////////////////////////

function MovieFlat() {
    this.scenesflat = [];

    this.add = function(sceneflat) {
        this.scenesflat.push(sceneflat);
    }
}

function SceneFlat(timeflat, typeflat, contentflat) {
    this.timeflat = timeflat;           // milliseconds
    this.typeflat = typeflat;           // same as Scene.type
    this.contentflat = contentflat || [''];     // rows of text (stored as array)
}
