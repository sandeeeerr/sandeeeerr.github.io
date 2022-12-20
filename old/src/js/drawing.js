// haal parameter uit url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlLetter = urlParams.get('letter')
// localStorage. clear();

// maak lege arrays
var svgPathArray = [];
var letterColors = [];
var drawColors = [];

if (typeof letters !== 'undefined') {
  // loop door alle letters
  letters.forEach(letter => {
    for (let key in letter) {
      if (letter[key] === urlLetter) {
        // zet svg paden in lege array
        svgPathArray = letter.path;
        letterColors = letter.letterColor;
        drawColors   = letter.drawColor;
        letterTxt    = letter.letter;
        // dit moet nog ff in losse functie
        document.getElementById("titleLetter").innerHTML = letter.letter;
        document.getElementById("titlePronunciation").innerHTML = letter.pronunciation;
        var audio = './src/sound/'+letter.pronunciation+'.mp3';
        $("#audio").attr("src", audio);
      }
    }
  })
} else {
  document.write('error');
}

if (localStorage.getItem(urlLetter) >= 5) {
  window.location.href = 'done.html?letter=' + urlLetter + '&fromTasks=false';
  add_coins(5);
  add_xp(10);
}

var c = document.querySelector('canvas');
var cx = c.getContext('2d');
var xoffset = 0;
var yoffset = 0;

var mousedown = false;
var touched = false;
var oldx = 0;
var oldy = 0;

var drawingPixels = null;
var letterPixels = null;
var step = null;
var wrong = null;

function setupCanvas(step) {

  if (svgPathArray.length === 0) {
    // er zijn geen stappen beschikbaar
    document.write('er gaat iets fout');
  } else {
    // instellingen van canvas
    c.height = 300;
    c.width = 300;
    cx.lineWidth = 30;
    cx.lineCap = 'round';

    // kleur van layout/achtergrond
    letterColor = 'rgb(' + letterColors[0] + ', ' + letterColors[1] + ', ' + letterColors[2] + ')';
    cx.fillStyle = letterColor;

    // kleur van drawing
    drawColor = 'rgb(' + drawColors[0] + ', ' + drawColors[1] + ', ' + drawColors[2] + ')';
    cx.strokeStyle = drawColor;

    // kleur van drawing, maar gebruik deze bij goedkeuren
    drawColorCheck = 'rgb(' + drawColors[0] + ', ' + drawColors[1] + ', ' + (drawColors[2] + 1) + ')';

    // als alle steps done zijn
    if (svgPathArray.length == step) {
      // reload
      play();
      setTimeout(function() {

        document.getElementById("right").style.display = "block";

      }, 300);

      setTimeout(function() {
        localStorage.setItem(urlLetter, Number(localStorage.getItem(urlLetter)) + 1);
        updateProgressBar();

        window.location.reload();
      }, 1000);
      // location.reload();
    }

    if (step == 0) {
      cx.fillStyle = letterColor;
      drawSVG(0);
    } else if (step == 1) {
      cx.fillStyle = letterColor;
      drawSVG(step);
      cx.fillStyle = drawColorCheck;
      drawSVG(0);

    } else if (step == 2) {
      cx.fillStyle = letterColor;
      drawSVG(step);
      cx.fillStyle = drawColorCheck;
      drawSVG(1);
      drawSVG(0);
    } else if (step == 3) {
      cx.fillStyle = letterColor;
      drawSVG(step);
      cx.fillStyle = drawColorCheck;
      drawSVG(2);
      drawSVG(1);
      drawSVG(0);
    }

  }

  drawingPixels = cx.getImageData(0, 0, c.width, c.height);
  letterPixels = getpixelamount(letterColors[0], letterColors[1], letterColors[2]);

}



function drawSVG(counter) {

  // maakt svg

  var path = new Path2D(svgPathArray[counter]);


  cx.translate(50, 50);
  this.cx.fill(path);
  cx.translate(-50, -50);
};

function paint(x, y) {
  var rx = x - xoffset;
  var ry = y - yoffset;
  var colour = getpixelcolour(x, y);

  cx.beginPath();
  if (oldx > 0 && oldy > 0) {
    cx.moveTo(oldx, oldy);
  }
  cx.lineTo(rx, ry);
  cx.stroke();
  cx.closePath();
  oldx = rx;
  oldy = ry;

  // console.log(colour);
  if (colour.a == 0) {

    setTimeout(function() {
      document.getElementById("wrong").style.display = "block";

    }, 400);
    setTimeout(function() {
      window.location.reload();

      localStorage.setItem('fout', 1);
    }, 1000);

    // console.log(colour.a);
    // setupCanvas(0);
  }

};

function getpixelcolour(x, y) {
  var index = ((y * (drawingPixels.width * 4)) + (x * 4));
  return {
    r: drawingPixels.data[index],
    g: drawingPixels.data[index + 1],
    b: drawingPixels.data[index + 2],
    a: drawingPixels.data[index + 3]
  };
}

function getpixelamount(r, g, b) {
  var drawingPixels = cx.getImageData(0, 0, c.width, c.height);
  var all = drawingPixels.data.length;
  var amount = 0;
  for (i = 0; i < all; i += 4) {
    if (drawingPixels.data[i] === r &&
      drawingPixels.data[i + 1] === g &&
      drawingPixels.data[i + 2] === b) {
      amount++;
    }
  }
  return amount;
};

function pixelthreshold() {
  // setTimeout(function(){
  //   document.getElementById("wrong").style.display = "block";
  // }, 400);
  if (getpixelamount(drawColors[0], drawColors[1], drawColors[2]) / letterPixels > 0.4) {
    // step++;
    // setupCanvas(step);
    // console.log('goed');
    // location.reload();
    setTimeout(function(){
      step++;
      setupCanvas(step);
      console.log('goed');
    }, 100);
  }
};

function updateProgressBar() {

  var bar = document.getElementById("bar");
  bar.style.width = localStorage.getItem(urlLetter) * 20 + '%';
  document.getElementById("barText").innerHTML = localStorage.getItem(urlLetter);

  if (localStorage.getItem(urlLetter) == 0) {
    bar.style.width = '20px';
  }
}


function onmousedown(ev) {
  mousedown = true;
  ev.preventDefault();
};

function onmouseup(ev) {
  mousedown = false;
  pixelthreshold();
  ev.preventDefault();
};

function onmousemove(ev) {

  var x = Math.round(ev.clientX - c.getBoundingClientRect().left);
  var y = Math.round(ev.clientY - c.getBoundingClientRect().top);
  if (mousedown) {
    paint(x, y);
  }
};

function ontouchstart(ev) {
  touched = true;
};
function ontouchend(ev) {
  touched = false;
  oldx = 0;
  oldy = 0;
  pixelthreshold();
};
function ontouchmove(ev) {
  if (touched) {
    paint(
      ev.changedTouches[0].pageX - c.getBoundingClientRect().left,
      ev.changedTouches[0].pageY - c.getBoundingClientRect().top
    );
    ev.preventDefault();
  }
};

c.addEventListener('mousedown', onmousedown, false);
c.addEventListener('mouseup', onmouseup, false);
c.addEventListener('mousemove', onmousemove, false);

c.addEventListener('touchstart', ontouchstart, false);
c.addEventListener('touchend', ontouchend, false);
c.addEventListener('touchmove', ontouchmove, false);

if (urlLetter) {
  setupCanvas(0);
  updateProgressBar();
  console.log(localStorage.getItem(urlLetter));
  // localStorage.task = 0;

  if (localStorage.getItem(urlLetter)) {
    // console.log('isset');
  } else {
    localStorage.setItem(urlLetter, 0);
  }
  // localStorage.setItem(task, urlLetter);

} else {
  document.getElementById("drawIcon").innerHTML = '‼️‼️';
  document.getElementById("drawTitle").innerHTML = 'Er is iets fout gegaan!';
  document.getElementById("drawUnderTitle").innerHTML = '';
}

function play() {
  var audio = document.getElementById("audio");
  audio.play();
}
// // localStorage.clear();
// fout = Number(localStorage.getItem('fout'));
// localStorage.setItem('fout', 0);
// if (fout = 1) {
//   // fout++;
//   console.log('fout');
//   console.log(fout);
//
//
//   // console.log(fout);
// }
fout = Number(localStorage.getItem('fout'));
var foutLetterVar = 'fout'+letterTxt;

if (fout === 1) {
  var currentFout = Number(localStorage.getItem(foutLetterVar)) + 1;
  localStorage.setItem(foutLetterVar, currentFout);
  localStorage.setItem('fout', 0);
}
console.log(localStorage.getItem(foutLetterVar));
if (localStorage.getItem(foutLetterVar) >= 3) {
  document.getElementById("coliHelp").style.display = "block";
  href = 'help.html?letter=' + urlLetter;
  $("#coliHelp").attr("href", href);
}
