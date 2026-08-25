//smoothing by 'cutting' the corners
function smoothing(points, iterations){
    var pts = points;

    for (var i = 0; i < iterations; i++) {
        var next = [pts[0]];
        for (var j = 0; j < pts.length - 1; j++) {
            var p0 = pts[j];
            var p1 = pts[j + 1];
            next.push({ x: 0.75 * p0.x + 0.25 * p1.x,
                y: 0.75 * p0.y + 0.25 * p1.y});
            next.push({ x: 0.25 * p0.x + 0.75 * p1.x,
                y: 0.25 * p0.y + 0.75 * p1.y});
        }

        next.push(pts[pts.length - 1]);
        pts = next;
    }
    return pts;
}

// recording points and cumulative distance (totaldist) to reach
function totalDistance(points){
    var table = [{ point: points[0], totaldist: 0}];

    for (var i = 1; i < points.length; i++){
        var previous = points[i - 1];
        var current = points[i];
        var px = current.x - previous.x;
        var py = current.y - previous.y;

        var seglength = Math.sqrt(px * px + py * py);
        var distance = table[i - 1].totaldist;
        var total = distance + seglength;

        table.push({
            point: current,
            totaldist: total
        });
    }

    return table;
}

//measure characters for spacing
function measureChar(c, text){
    var tokens = [];
    var textlength = 0;
    for (var i = 0; i < text.length; i++){
        var char = text[i];
        var width = c.measureText(char).width;
        tokens.push({ char: char, width: width});
        textlength += width;
    }
    return {
        tokens: tokens,
        textlength: textlength
    }
}

//finding spots on the curve for the letters
function pathPosition(table, pathPos){
    if (pathPos <= 0){
        return table[0].point;
    }
    if (pathPos >= table[table.length - 1].totaldist){
        return table[table.length - 1].point;
    }

    var low = 0;
    var high = table.length - 1;
    while (high - low > 1) {
        var mid = Math.floor((low + high) / 2);
        if (table[mid].totaldist <= pathPos) low = mid;
        else high = mid;
    }

    var d = (pathPos - table[low].totaldist) / (table[high].totaldist - table[low].totaldist);
    return {
        x: table[low].point.x + d * (table[high].point.x - table[low].point.x),
        y: table[low].point.y + d * (table[high].point.y - table[low].point.y)
    };
}

// find the direction the path is heading 
function getDirection(table, pathPos){
    var delta = 4; //can tweak if letters too close or apart
    var ahead = pathPosition(table, pathPos + delta);
    var behind = pathPosition(table, pathPos - delta);
    return Math.atan2(ahead.y - behind.y, ahead.x - behind.x);
}

function placeText(output, options){
    if (!options){
        options = {};
    }

    var defaults = {
        fontsize: 32,
        threshold: 30
    };
    
    var settings = Object.assign({}, defaults, options);

    var onWord = null;
    if (options.onWord){
        onWord = options.onWord;
    }

    var measure = document.createElement('canvas').getContext('2d');
    measure.font = settings.fontsize + 'px DotMatrix, Arial Narrow, Arial, sans-serif';

    var pathWithWords = 0;

    function update(points){ //new stroke started
        if (points.length === 1) pathWithWords = 0;
        if (points.length < 2) return;

        var smoothed = smoothing(points, 3);
        var pathLength = totalDistance(smoothed);
        var totalPath = pathLength[pathLength.length - 1].totaldist;

        while (totalPath - pathWithWords >= settings.threshold) {
            var word = peekPhrase();
            if (!word) break;

            var wordLength = measureChar(measure, word).textlength;          
            if(totalPath - pathWithWords < wordLength) break;

            phrase();
            placeWord(pathLength, pathWithWords, word, onWord);
            pathWithWords += wordLength + settings.threshold;
        }
    }

    function placeWord(pathLength, startPath, word, onWord){
        var measured = measureChar(measure, word);
        var pathPos = startPath;
        var letters = [];

        for (var i = 0; i < measured.tokens.length; i++) {
            var token = measured.tokens[i];
            if (token.char === ' ' ) {
                pathPos += token.width;
                continue;
            }

            var pos = pathPosition(pathLength, pathPos);
            var angle = getDirection(pathLength, pathPos);

            letters.push({
                char: token.char,
                pos: pos,
                angle: angle
            });

            pathPos += token.width;
        }

        if (onWord) onWord(letters);
    }

    return {
        update: update
    };

}