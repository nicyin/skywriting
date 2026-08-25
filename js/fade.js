function fade(output, options) {
    if(!options) {
        options = {};
    }

    var defaults = {
        timer: 2000,
        duration: 4000,
        fontsize: 32,
        color: '#ffffff',
        //delay: 200,
        maxblur: 8
    }

    var settings = Object.assign({}, defaults, options);

    var ctx = output.getContext('2d');

    function setupStyles(){
        ctx.font = settings.fontsize + 'px DotMatrix, Arial Narrow, Arial, sans-serif';
        ctx.fillStyle = settings.color;
        ctx.textBaseline = 'middle';
    }
    setupStyles();

    var stroke = [];
    var groups = [];

    function addWord(letters){
        //stroke.push(letters); //vs concat.()

        groups.push({
            letters: letters,
            endedAt: Date.now()
        });
    }

    /*function endStroke() {
        if(stroke.length === 0) return;
        
        stroke.forEach(function(letters, i){
            groups.push({
                letters: letters,
                endedAt: Date.now() + i * settings.delay
            });
        })

        stroke = [];
    }*/

    function render() {

        ctx.clearRect(0, 0, output.width, output.height);

        function drawLetters(letters) {
            letters.forEach(function(letter){
                ctx.save();
                ctx.translate(letter.pos.x, letter.pos.y); //pos from letters from placeWord()
                ctx.rotate(letter.angle);
                ctx.fillText(letter.char, 0, 0);
                ctx.restore();
            });
        }

        /*ctx.globalAlpha = 1;
        stroke.forEach(function(letters) {
            drawLetters(letters);
        });*/

        var now = Date.now();

        groups = groups.filter(function(g) {
            return now - g.endedAt < settings.timer + settings.duration;
        });

        groups.forEach(function(g) {
            var age = now - g.endedAt;
            var opacity = 1;
            var blur = 0;
            if (age > settings.timer) {
                var prog = (age - settings.timer) / settings.duration;
                opacity = 1 - prog;
                blur = prog * settings.maxblur;
            }

            ctx.globalAlpha = opacity;
            if (blur > 0) {
                ctx.filter = 'blur(' + blur + 'px)';
            } else {
                ctx.filter = 'none';
            }
            drawLetters(g.letters);
        })

        ctx.globalAlpha = 1;
        ctx.filter = 'none';
    }

    return {
        addWord: addWord,
        //endStroke: endStroke,
        render: render,
        setupStyles: setupStyles
    }
}