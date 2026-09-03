var backgroundCanvas = document.getElementById('background-canvas');
var drawCanvas = document.getElementById('draw-canvas');
var textCanvas = document.getElementById('text-canvas');
document.fonts.load('32px DotMatrix');

function sizeCanvases() {
  [backgroundCanvas, drawCanvas, textCanvas].forEach(function(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

//time of day
function tod(hour) {
  if (hour < 6 || hour >= 21) return 'night';
  if (hour < 14 ) return 'morning';
  return 'afternoon';
}

function gradient(ctx, canvas, period) {
  var bg = ctx.createLinearGradient(0, 0, 0, canvas.height);

  if (period === 'morning') {
      bg.addColorStop(0, '#498FDD');
      bg.addColorStop(0.7, '#B0D2F3')
  } else if (period === 'afternoon') {
      bg.addColorStop(0, '#33974D');
      bg.addColorStop(0.7, '#D98DC0');
      bg.addColorStop(0.94, '#FFC8ED')
  } else {
      bg.addColorStop(0, '#334797');
      bg.addColorStop(0.7, '#6B7391');
      bg.addColorStop(0.94, '#9094A3')
  }

  return bg;
}

function sun(ctx, canvas, period){
  var cx = canvas.width / 2;
  var cy = canvas.height * 1.1;
  var r = canvas.height * 0.35;

  var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);

  if (period === 'morning') {
      glow.addColorStop(.33, 'rgba(242, 243, 176, 1)');
      glow.addColorStop(.66, 'rgba(242, 243, 176, .5)');
      glow.addColorStop(1, 'rgba(242, 243, 176, 0)')
  } else if (period === 'afternoon') {
    glow.addColorStop(.33, 'rgba(255, 178, 118, 1)');
    glow.addColorStop(.66, 'rgba(255, 178, 118, .5)');
    glow.addColorStop(1, 'rgba(255, 178, 118, 0)')
  } else {
    glow.addColorStop(.33, 'rgba(171, 121, 108, 1)');
    glow.addColorStop(.66, 'rgba(171, 121, 108, .5)');
    glow.addColorStop(1, 'rgba(171, 121, 108, 0)')
  }

  return glow;
}

function makeBG(canvas, t, day) {
  var period = day || tod(t.getHours());
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = gradient(ctx, canvas, period);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = sun(ctx, canvas, period);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

sizeCanvases();
makeBG(backgroundCanvas, new Date());

var textstyle = { fontsize: 32 };

//fade.js: fade() for timer, duration, delay etc.
var disappear = fade(textCanvas, textstyle);

//textpath.js: placeText() for threshold
var write = placeText(textCanvas, Object.assign({ onWord: disappear.addWord }, textstyle));

//draw.js: drawing()
var draw = drawing(drawCanvas, function(points) {
  write.update(points);
  //}, function() {
  //disappear.endStroke();
});

window.addEventListener('resize', function() {
  sizeCanvases();
  makeBG(backgroundCanvas, new Date());
  draw.setupStyles();
  disappear.setupStyles();
});

function loop() {
  disappear.render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);