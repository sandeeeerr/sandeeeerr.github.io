if (typeof letters !== 'undefined') {

  var taskProcArray = [];
  letters.forEach(letter => {

    if (localStorage.getItem(letter.letter) == null) {
      localStorage.setItem(letter.letter, "0");
      window.location.reload();
    }

    if (typeof letter.test !== 'undefined' && letter.test === true) {
      $('<a id="border" class="taskContainer">' +
          // '<div class="taskContainerInner">' +
            '<h3 class="taskTitle">Test' + letter.letters + '</h3>' +
          // '</div>' +
        '</a>').appendTo('#taskList');
    } else {


      var step        = localStorage.getItem(letter.letter) + '/5';
      var drawColors  = letter.drawColor;
      var drawColor   = 'rgb(' + drawColors[0] + ', ' + drawColors[1] + ', ' + drawColors[2] + ')';
      var url         = 'draw.html?letter=' + letter.letter;



      if (localStorage.getItem(letter.letter) == 0) {
        var stat      = 'lock';
      }

      if (localStorage.getItem(letter.letter) >= 5) {
        taskProcArray.push(letter.letter);
        var stat      = 'done';
        var step      = '';
        var url       = 'done.html?letter=' + letter.letter + '&fromTasks=true';
      }

      $('<a id="border' + letter.letter + '" href=' + url + ' class="taskContainer ' + stat + '">' +
          '<div class="taskIcon" id="bg' + letter.letter + '">' + letter.letter + '</div>' +
          '<div class="taskContainerInner">' +
            '<h3 class="taskTitle">Let’s write<br><b>' + letter.letter +'</b>  ('+ letter.pronunciation +')'+ '</h3>' +
            '<progress value="' + localStorage.getItem(letter.letter)*10 + '" max="50"></progress>' +
            '<p class="steps ' + stat + '">' + step + '</p>' +
          '</div>' +
        '</a>').appendTo('#taskList');

      $('#border'+letter.letter).css("border", '2px solid '+drawColor);
      $('#bg'+letter.letter).css("background-color", drawColor);
    }
  })
} else {
  document.write('error');
}
$($(".lock").get(0)).removeClass("lock");

// document.getElementById("progressbar").style="--value:"+parseInt(100/14*taskProcArray.length);
