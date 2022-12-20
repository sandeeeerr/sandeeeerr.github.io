function setValues() {
  // set XP, Level & Coins on first reload
  if ( localStorage.getItem("xp") == null ) {
    localStorage.setItem("xp", 0);
  }
  if ( localStorage.getItem("level") == null ) {
    localStorage.setItem("level", 0);
  }
  if ( localStorage.getItem("coins") == null ) {
    localStorage.setItem("coins", 0);
  }



  if (typeof items !== 'undefined') {
    items.forEach(item => {
      if ( localStorage.getItem(item.ID+"_bought") == null ) {
        localStorage.setItem(item.ID+"_bought", false);
      }
      if ( localStorage.getItem(item.ID+"_active") == null ) {
        localStorage.setItem(item.ID+"_active", false);
      }
    })
  } else {
    console.log('no items found');
  }

}

function updateValues() {

  // if xp is 60, level up and reset xp
  if (parseInt(localStorage.getItem('xp')) >= 60) {
    var level = parseInt(localStorage.getItem('level'));
    level++;
    localStorage.setItem("level", level.toString());
    localStorage.setItem("xp", 0);
    add_coins(50);
  }

  // level names as text
  if (parseInt(localStorage.getItem('level')) == 0) {
    $('#podium').attr('src', 'src/img/podium/1.png');
    $('.podium').addClass('l1');

    $("#levelVal").text('1');
    $("#levelValTxt").text('Bronze');
    $(":root").css({"--bg-color-lvl": "#C3792F"});
  } else if (parseInt(localStorage.getItem('level')) == 1) {
    $('#podium').attr('src', 'src/img/podium/2.png');
    $('.podium').addClass('l2');

    $("#levelVal").text('2');
    $("#levelValTxt").text('Silver');
    $(":root").css({"--bg-color-lvl": "#717075"});
  } else if (parseInt(localStorage.getItem('level')) == 2) {
    $('#podium').attr('src', 'src/img/podium/3.png');
    $('.podium').addClass('l3');

    $("#levelVal").text('3');
    $("#levelValTxt").text('Gold');
    $(":root").css({"--bg-color-lvl": "#E6AB13"});
  } else if (parseInt(localStorage.getItem('level')) == 3) {
    $('#podium').attr('src', 'src/img/podium/4.png');
    $('.podium').addClass('l4');

    $("#levelVal").text('4');
    $("#levelValTxt").text('Platinum');
    $(":root").css({"--bg-color-lvl": "#0098F2"});
  }

  // progress circle update
  // 100% = "0"
  // 0%   = "75"
  xpValForSVG = 75-parseInt(localStorage.getItem('xp'))/60*75;
  $(".circle-container__progress").css("stroke-dashoffset", xpValForSVG);

  $("#xpVal").text(localStorage.getItem('xp'));
  $("#coinsVal").text(localStorage.getItem('coins'));

  if (typeof items !== 'undefined') {
    items.forEach(item => {
      if ( localStorage.getItem(item.ID+"_bought") == null ) {
        localStorage.setItem(item.ID+"_bought", false);
      }
      if ( localStorage.getItem(item.ID+"_active") == 'true' ) {
        $('#coliAppend').prepend('<img class="item_img" src="src/img/coli/items/'+item.imgName+'.png" />');
      }
    })
  } else {
    console.log('no items found');
  }

}

function add_xp(amount) {
  var xp = parseInt(localStorage.getItem('xp'));
  var new_xp = xp + amount;
  localStorage.setItem("xp", new_xp.toString());
}
function add_coins(amount) {
  var coins = parseInt(localStorage.getItem('coins'));
  var new_coins = coins + amount;
  localStorage.setItem("coins", new_coins.toString());
}

function createShop() {
  if (typeof items !== 'undefined') {
    items.forEach(item => {
      var bought = localStorage.getItem(item.ID+"_bought").toLowerCase();
      var active = localStorage.getItem(item.ID+"_active").toLowerCase();

      if ( bought == 'false' ) {

        var button    = $('<button onclick="buy('+item.ID+', '+item.price+')">buy</button>');
        var content   = $('<div class="content">' +
                            '<div class="price">' +
                              '<span class="priceIcon"></span>' +
                              item.price +
                            '</div>' +
                          '</div>');
        var divClass  = '';

      } else if ( bought == 'true' && active == 'false' ) {

        var button    = $('<button onclick="activate('+item.ID+')"></button>');
        var divClass  = 'bought';

      } else if ( bought == 'true' && active == 'true' ) {

        var button    = $('<button onclick="deactivate('+item.ID+')"><i class="fa-solid fa-check"></i></button>');
        var divClass  = 'bought active';

      }

      var outerDiv    = $('<div class="itemContainer ' + divClass + '"></div>');
      var innerDiv    = $('<div class="itemContainerInner"></div>');
      var title       = $('<h5 class="itemName">' + item.itemName + '</h5>');
      var type        = $('<p class="itemType">' + item.type + '</hp>');

      var image       = $('<div class="coliAbsolute">' +
                            '<img class="coli_base" src="src/img/coli/coli_base.png">' +
                            '<img class="item_img" src="src/img/coli/items/' + item.imgName + '.png">' +
                          '</div>');

      innerDiv.append(title, type, content);
      outerDiv.append(image, innerDiv, button);

      $(outerDiv).appendTo('#itemListContainer');

    })
  } else {
    console.log('no items found');
  }
}

function buy(ID, price) {
  if ( Number(localStorage.getItem("coins")) >= price ) {
    localStorage.setItem(ID+"_bought", true);
    localStorage.setItem("coins", Number(localStorage.getItem("coins")) - price);

    activate(ID);
    // localStorage.setItem(ID+"_active", true);
    // window.location.reload();
  } else {
    alert('Not enough coins');
  }

}

function activate(ID, type) {

  var index = items.findIndex(items => items.ID === ID);

  items.forEach(item => {
    // console.log(item.type);
    if (item.type == items[index].type) {
      localStorage.setItem(item.ID+"_active", false);
    }
  })

  localStorage.setItem(ID+"_active", true);
  window.location.reload();
}

function deactivate(ID) {
  localStorage.setItem(ID+"_active", false);
  window.location.reload();
}

setValues();
updateValues();

if (window.location.href.indexOf("shop") > -1) {
  createShop();
}
