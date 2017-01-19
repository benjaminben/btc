(function(){

var burger = document.getElementById("burger")
var nav    = document.getElementById("nav")

var openNav = function(e) {
  nav.className += " active"
}
var closeNav = function(e) {
  nav.className = nav.className.replace(/(?:^|\s)active(?!\S)/, '')
}

burger.addEventListener("click", function(e) {
  return(
    nav.className.indexOf("active") === -1
    ?
    openNav(e)
    :
    closeNav(e)
  )
})

})()
