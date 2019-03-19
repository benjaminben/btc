(function(){

main()

var view = document.body.getAttribute("data-view").toUpperCase()

switch (view) {
  case "ABOUT":
    about()
    break
  case "CONTACT":
    contact()
    break
  case "TESTIMONIALS":
    testies()
    break
}


function main() {
  var burger = document.getElementById("burger")
  var nav    = document.getElementById("nav")

  var openNav = function(e) {
    nav.className += " active"
  }
  var closeNav = function(e) {
    nav.className = nav.className.replace(/(?:^|\s)active(?!\S)/, "")
  }

  document.querySelector("nav a.about").addEventListener("click", function(e) {
    closeNav()
  })

  burger.addEventListener("click", function(e) {
    return(
      nav.className.indexOf("active") === -1
      ?
      openNav(e)
      :
      closeNav(e)
    )
  })
}

function about() {
  whataBurger()

  var sections = Array.from(document.getElementsByClassName("section"))
  var eye_cont = document.getElementById("about_content")
  sections.forEach(function(section, i) {
    section.btn = section.getElementsByClassName("header")[0]
    section.btn.addEventListener("click", function(e) {
      if (section.className.indexOf("active") === -1) {
        section.className += " active"
        if (window.innerWidth >= 1300) {
          var y = window.pageYOffset + section.clientHeight
          window.scroll(0, y)
        }
        return
      }
      section.className = section.className.replace(/(?:^|\s)active(?!\S)/, "")
    })
  })
}

function contact() {
  var form = document.getElementById("contact_form")
  var email = document.getElementById("contact_email")
  var subject = document.getElementById("contact_subject")
  var body = document.getElementById("contact_body")
  var error = document.getElementById("contact_error")

  document.getElementById("contact_direct").setAttribute("href", "mailto:info@benteachescode.com")

  form.addEventListener("submit", function(event) {
    form.className += " submitting"

    try {
      if (email.value.length === 0) {
        throw "EMAIL_LENGTH"
      }
      else if (!email.value.match(/@.*\./)) {
        throw "EMAIL_FORMAT"
      }
      else if (subject.value.length === 0) {
        throw "SUBJECT_LENGTH"
      }
      else if (body.value.length === 0) {
        throw "BODY_LENGTH"
      }
    }
    catch (err) {
      var errMsg = ""

      switch (err) {
        case "EMAIL_LENGTH":
          errMsg = "Please enter an email address for me to write back to"
          break
        case "EMAIL_FORMAT":
          errMsg = "Please enter a valid email address (@ n' all that)"
          break
        case "SUBJECT_LENGTH":
          errMsg = "Please enter a subject for your message. We can talk about anything!"
          break
        case "BODY_LENGTH":
          errMsg = "Definitely gonna need a body on that"
          break
      }

      form.className = form.className.replace(/(?:^|\s)submitting(?!\S)/, "")
      error.textContent = errMsg
      event.preventDefault()
    }
  })
}

function whataBurger() {
  var bt
  var about_title = document.getElementById("about_title")
  var about_content = document.getElementById("about_content")
  var burger_scroller = document.getElementById("burger_scroller")
  var burger = document.getElementById("burger_cont")
  var bites = [
    document.getElementById("bun_top"),
    document.getElementById("fixins"),
    document.getElementById("patty"),
    document.getElementById("bun_bottom"),
  ]
  var soundbites = [
    document.getElementById("learn"),
    document.getElementById("the_whole"),
    document.getElementById("stack"),
  ]

  var scroll_cta = document.getElementById("scroll_cta")
  var scrollCTA = function() {
    scroll_cta.className += " inactive"
    setTimeout(function(){
      burger.removeChild(scroll_cta)
    }, 333)
    window.removeEventListener("scroll", scrollCTA)
  }
  window.addEventListener("scroll", scrollCTA)

  bt = new TimelineMax()

  bites.forEach(function(b,i,a) {
    var tween1 = new TweenMax(b, 1, {y: -100})
    bt.add(tween1, 1*(i+1))
    var tween2 = new TweenMax(b, 1, {y: 0})
    bt.add(tween2, 1*a.length)
  })
  soundbites.forEach(function(sb,i,a) {
    var tween1 = new TweenMax.fromTo(sb, 1,
      {yPercent: 0, autoAlpha: 0, scale: 1, transformOrigin: "center"},
      {y: -66, autoAlpha: 1, scale: 1.2}
    )
    var tween2 = new TweenMax.to(sb, 0.5, {
      yPercent: -100,
      autoAlpha: 0,
      scale: 0.8,
    })
    bt.add(tween1, 1*(i+1))
    bt.add(tween2, 1*(i+2))
  })
  bt.add(new TweenMax.to(about_title, 1, {autoAlpha: 0}), 0)

  var getScrollHeight = function() {
    return(
        (burger_scroller.clientHeight
              + burger_scroller.offsetTop)
        -
        (burger.clientHeight * 1.5)
    )
  }

  var scroller = new ScrollMagic.Controller()

  var scene = new ScrollMagic.Scene({
    triggerElement: "#burger_trigger",
    triggerHook: 1,
    duration: getScrollHeight,
  })
  .setPin(burger)
  .setTween(bt)
  .addTo(scroller)

  var scene2 = new ScrollMagic.Scene({
    triggerElement: "#burger_trigger2",
    triggerHook: 1,
  })
  .setClassToggle("#burger_scroller", "now")
  .addTo(scroller)

}

function testies() {
  console.log('huff')
}

})()
