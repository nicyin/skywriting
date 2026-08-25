function drawing(drawcanvas, stillDrawing, onStrokeEnd) {
    var s = drawcanvas.getContext('2d');

    var cursor = new Image();
    cursor.src = 'cursor.svg';

    var points = []; //points from line
    var isDrawing = false;
    var angle = 0;

    function setupStyles() {
        s.strokeStyle = 'white';
        s.lineWidth = 8;
        s.lineCap = 'round';
        s.lineJoin = 'round';
    }
    setupStyles();

    function airplane(pos, angle){
        s.clearRect(0, 0, drawcanvas.width, drawcanvas.height);
        if(!cursor.complete) return;
    
        s.save();
        s.translate(pos.x, pos.y);
        s.rotate(angle);
        s.drawImage(cursor, -cursor.width / 2, -cursor.height / 2);
        s.restore();
    }

    drawcanvas.addEventListener('pointerdown', function(e) {
        if(e.button !== 0) return;

        e.preventDefault();

        var pos = getCoordinates(e);
        points = [pos];
        isDrawing = true;

        if(stillDrawing) {
            stillDrawing(points);
        }
    });

    drawcanvas.addEventListener('pointermove', function(e) {

        var pos = getCoordinates(e);

        if(isDrawing) {
            e.preventDefault();

            var previous = points[points.length - 1];
            var sx = pos.x - previous.x;
            var sy = pos.y - previous.y;

            points.push(pos);
            angle = Math.atan2(sy, sx);

            if(stillDrawing){
                stillDrawing(points);
            }
        }

        airplane(pos, angle);
    })

    drawcanvas.addEventListener('pointerenter', function(e){
        airplane(getCoordinates(e), angle);
    });
    
    function pointerEnd(e) {
        e.preventDefault();
        if(!isDrawing) return;
        isDrawing = false;

        if (onStrokeEnd) {
            onStrokeEnd(points);
        }
    }

    drawcanvas.addEventListener('pointerup', pointerEnd);
    drawcanvas.addEventListener('pointercancel', pointerEnd);

    //converting coordinates
    function getCoordinates(e) {
        var rect = drawcanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (drawcanvas.width / rect.width),
            y: (e.clientY - rect.top) * (drawcanvas.height / rect.height)
        }
    }

    return { setupStyles: setupStyles};
}