/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementsByClassName("sidenav")[0].style.width = "25%";
  document.getElementsByClassName("sidenav")[0].style.minWidth = "200px";
  document.getElementsByClassName("main")[0].style.marginLeft = "25%";
  document.getElementsByClassName("openbtn")[0].style.visibility = "hidden";
}
  
/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementsByClassName("sidenav")[0].style.width = "0";
  document.getElementsByClassName("sidenav")[0].style.minWidth = "0px";
  document.getElementsByClassName("main")[0].style.marginLeft = "0";
  document.getElementsByClassName("openbtn")[0].style.visibility = "visible";
}

async function parseDrinks(location = "products/drinks.csv") {
  let raw = await fetch(location)
   .then( r => r.text() );
  var lines = raw.split("\n").map(x => x.split(";"));
  var headers = lines[0];
  var drinks = lines.slice(1,-1);
  return [headers, drinks];
}

function createListItem(drinkname) {
  var html = 
    '<tr>\
      <td>\
        <a href=\"#\" onclick=\"fetchProduct(\'' + drinkname + '\')\">\
          <img src=\"images/' + drinkname + '.jpg\" width=\"30%\">\
        </a>\
      </td>\
      <td>' + drinkname + '</td>\
    </tr>';

  return html;
}

function createCarbonBreakdown(headers, values) {
  var text = "";
  for(var i = 1; i < headers.length; i++) {
    if(values[i] != 0) {
      text += "<tr>\
          <td>" + headers[i] + "</td>\
          <td>" + carbonPerTrip(headers[i], values[i]) + "</td>\
      </tr>"
    }
  }

  return text;
}

async function fetchPage(page) {
  $.ajax({
    url: page,
    dataType: 'html',
    type: 'GET',
    async: true,
    crossDomain: true,
    success: function (result) {
      $(".main").html(result);
    },
    failure: function () { },
    complete: function () {}
  });
}

async function fetchProduct(prodname) {
  await fetchPage("ProductPage.html");
  parseDrinks().then(drinkinfo => {
    var productIngredientValues = drinkinfo[1].filter(drink => drink[0]==prodname)[0];
    $(".carbonbreakdown").append(createCarbonBreakdown(drinkinfo[0], productIngredientValues));
    $(".productpageimg").attr("src", "images/" + prodname + ".jpg");
    $(".totalemission").html(calculateCarbon(drinkinfo[0], productIngredientValues) + " gCO<sub>2</sub>");
    $(".producttitle").html(prodname);
  });
}

function fetchProductList() {
  fetchPage('ProductListing.html');
  parseDrinks().then(function(drinkinfo) {
    drinkinfo[1].forEach(drink => {
      $("#myTable").append(createListItem(drink[0]));
    });
  });
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}
function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return earthRadiusKm * c;
  }
var cords = [['reykjavik',64.14015,-21.905440],
       ['london', 51.405825,0],
       ['copenhagen',55.669543,12.624310],
       ['new york',41.018295,-73.629060],
       ['bamberg',49.885997,10.889477],
       ['stockholm', 59.255696, 18.103223],
       ['oslo', 59.840536,10.540309],
       ['berlin', 52.5200, 13.4050],
       ['hong kong', 22.3193, 114.1694]];
var ingred = [['sugar','london'],
        ['barley(DE)','berlin'],
        ['barley(UK)','london'],
        ['co2','hong kong'],
        ['kollagen','reykjavik'],
        ['aluminum_can(33cl)','stockholm'],
        ['plastic_bottle(50cl)','stockholm']];
var drinks0 = ['drink','sugar','barley(DE)','barley(UK)','co2','kollagen','aluminum_can(33cl)','aluminum_can(50cl)','glass_bottle(33cl)','plastic_bottle(50cl)','plastic_bottle(100cl)','plastic_bottle(200cl)','jagermeister'];
var drinks1 = [['pepsi',36,0,0,1,0,1,0,0,0,0,0,0],
         ['brio',0,62,0,1,0,1,0,0,0,0,0,0],
         ['jagermeister',0,0,0,0,0,0,0,0,0,0,0,1],
         ['collab',0,0,0,1,6,1,0,0,0,0,0,0]];
function distanceToRey(city){
  var i;
  for(i =0; i<cords.length;i++){
          if(cords[i][0] == city){
                  var lat = cords[i][1];
                  var lon = cords[i][2];
          }
  }
  return distanceInKmBetweenEarthCoordinates(64.14015,-21.905440,lat,lon);
}
function carbonPerTrip(ing,g){
  var i;
  var j;
  if(ing==drinks0[6])
    return 58;
  for(i=0;i<ingred.length;i++){
          if(ingred[i][0] == ing){
                  return Math.round(g*0.036*distanceToRey(ingred[i][1]))/1000.0;
          }
  }
}


function calculateCarbon(ingredientNames, ingredientValues){
  var total = 0;
  for(var i=0;i<ingredientNames.length;i++){
    if(ingredientValues[i] > 0)
      total += carbonPerTrip(ingredientNames[i], ingredientValues[i]);
  }

  return Math.round(total);
}