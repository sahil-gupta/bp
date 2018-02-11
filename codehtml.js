// node codehtml.js
// turns html into json

const FILEIN = './originals/GAv1.html';
const FILEOUT = './GAv1.json';

var fs = require('fs');
var nlp = require('compromise');

var text = fs.readFileSync(FILEIN).toString();
var textLines = text.split('\n');

var m = new Movie();
var s;

for (var i in textLines) {
    var line = textLines[i];

    if (isOpenTag(line)) {
        s = new Scene(cleanTag(line));
    } else if (isCloseTag(line)) {
        m.add(s);
    } else {
        if (!s.content)
            s.content = line;
        else
            s.content += ' ' + line;
    }
}

for (var j in m.scenes) {
    if (m.scenes[j].type !== 'p')           // ignore non-paragraphs
        continue;

    var content = m.scenes[j].content;      // start parsing paragraphs

    // heree check for quotations
    // have scene type "dialogue"

    var sentences = [];

    const SHORTPARA = 70;
    if (content.length < SHORTPARA) {       // if short paragraph
        // note: the type is "sentence" but it might have 1-3 sentences
        // because it's a short paragraph
        sentences = [new Scene('sentence', content)];
    } else {                                // if normal paragraph
        var tree = nlp(content);
        var rawSentences = tree.sentences().data();
        sentences = rawSentences.map(obj => new Scene('sentence', obj.text.trim()));

        // flag long sentences
        const TOOLONG = 400;
        for (var k in sentences) {
            if (sentences[k].content.length > TOOLONG)
                console.log('too long:\n' + sentences[k].content);
        }
    }

    m.scenes[j].content = sentences;
}

fs.writeFile(FILEOUT, JSON.stringify(m, null, 4));

//////////////////////////////////////////////////////////////

function cleanTag(line) {
    return line.substring(1, line.length - 1);
}

function isOpenTag(line) {
    // ignore i tags
    if (line === '<i>')
        return false;

    return (line[0] === '<' && line[line.length-1] === '>' && line[1] !== '/');
}

function isCloseTag(line) {
    // ignore i tags
    if (line === '</i>')
        return false;

    return (line[0] === '<' && line[line.length-1] === '>' && line[1] === '/');
}

//////////////////////////////////////////////////////////////

function Movie() {
    this.scenes = [];

    this.add = function(scene) {
        this.scenes.push(scene);
    }
}

// goal is to keep the scenes flat
// only exception is <p> which has nested content
function Scene(type, content) {
    // stored as tagname without angle brackets
    // initbook <book>
    // initpart <part> (like part 2. chapter 7.)
    // initchapter <chapter>
    // initsection <section>
    // paragraph whitespace break <pbreak>
    // paragraph <p>
    // image <img>
    // sentence (in interior of paragraph)
    // dialogue (in interior of paragraph)
    this.type = type || '';

    // if type is 'p', then content is array of Scene objects
    // if type isn't 'p', then content is string
    this.content = content || '';
}
