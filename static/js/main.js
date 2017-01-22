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
  sections.forEach(function(section, i) {
    section.btn = section.getElementsByClassName("button")[0]
    section.btn.addEventListener("click", function(e) {
      if (section.className.indexOf("active") === -1) {
        section.className += " active"
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
  var burger = document.getElementById('burger_svg')
  var bites = [
    document.getElementById("bun_top"),
    document.getElementById("fixins"),
    document.getElementById("patty"),
    document.getElementById("bun_bottom"),
  ]

  bt = new TimelineMax()

  bites.forEach(function(b,i) {
    var tween = new TweenMax(b, 1, {y: -100})
    bt.add(tween, 1*i)
  })

  var scroller = new ScrollMagic.Controller()

  var scene = new ScrollMagic.Scene({
    // triggerElement: "#burger_trigger",
    triggerHook: 1,
    duration: "100%",
    setPin: "#burger_cont"
  })
  .addIndicators({
    name: "burger?",
    colorTrigger: "black",
    colorStart: "green",
    colorEnd: "red",
  })
  .setTween(bt)
  .addTo(scroller)

  // bites.forEach(function(b,i) {
  //   var scene = new ScrollMagic.Scene({
  //     triggerElement: b,
  //     triggerHook: 1,
  //     duration: '100%'
  //   })
  //   .setTween(TweenMax.from(b, 1, {
  //     y: "100px",
  //   }))
  //   // .addIndicators({
  //   //   name: "fadie",
  //   //   colorTrigger: "black",
  //   //   colorStart: "green",
  //   //   colorEnd: "red",
  //   // })
  //   .addTo(scroller)

  //   console.log(scene)
  // })

}

function testies() {
  console.log('huff')
}

})()
