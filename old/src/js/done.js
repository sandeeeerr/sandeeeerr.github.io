// haal parameter uit url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlLetter = urlParams.get('letter')
// console.log(urlLetter);
if (typeof letters !== 'undefined') {
  // loop door alle letters
  letters.forEach(letter => {
    for (let key in letter) {
      if (letter[key] === urlLetter) {
        // zet svg paden in lege array
        // svgPathArray = letter.path;
        // letterColors = letter.letterColor;
        // drawColors   = letter.drawColor;
        // dit moet nog ff in losse functie
        document.getElementById("titleLetter").innerHTML = letter.letter;
        document.getElementById("titlePronunciation").innerHTML = letter.pronunciation;

        var imgUrl = './src/img/words/'+letter.pronunciation+'.png';
        $("#word").attr("src", imgUrl);

        var audio = './src/sound/'+letter.pronunciation+'.mp3';
        $("#audio").attr("src", audio);


      }
    }
  })
} else {
  document.write('error');
}
