/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementsByClassName("sidenav")[0].style.width = "25%";
  document.getElementsByClassName("main")[0].style.marginLeft = "25%";
  document.getElementsByClassName("openbtn")[0].style.visibility = "hidden";
}
  
/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementsByClassName("sidenav")[0].style.width = "0";
  document.getElementsByClassName("main")[0].style.marginLeft = "0";
  document.getElementsByClassName("openbtn")[0].style.visibility = "visible";
}

$(document).ready(function(){
 $.ajax({
    url: 'ProductListing.html',
    dataType: 'html',
    type: 'GET',
    async: true,
    crossDomain: true,
    success: function (result) {
      console.log(result);
      $(".main").html(result);
    },
    failure: function () { },
    complete: function () {}
  });
});

