package main

import(
  "net/http"
  "html/template"
  "io"
)

var templates = template.Must(
  template.ParseFiles(
    "./static/header.html",
    "./static/footer.html",
    "./static/about.html",
    "./static/contact.html",
    "./static/testies.html",
  ))

type Page struct {
  Title string
}

type TemplateExecutor interface{
    ExecuteTemplate(wr io.Writer, name string, data interface{}) error
}

type DebugTemplateExecutor struct  {
    Glob string
}

func (e DebugTemplateExecutor) ExecuteTemplate(wr io.Writer, name string, data interface{}) error {
    t := template.Must(template.ParseGlob(e.Glob))
    return t.ExecuteTemplate(wr, name, data)
}

type ReleaseTemplateExecutor struct  {
    Template *template.Template
}

func (e ReleaseTemplateExecutor) ExecuteTemplate(wr io.Writer, name string, data interface{}) error {
    return e.Template.ExecuteTemplate(wr, name, data)
}




const templateGlob = "static/*.html"
const debug = true

var executor TemplateExecutor



func handleAbout(res http.ResponseWriter, req *http.Request) {
  executor.ExecuteTemplate(res, "about", &Page{Title: "About"})
}

func handleContact(res http.ResponseWriter, req *http.Request) {
  if req.Method == "GET" {
    executor.ExecuteTemplate(res, "contact", &Page{Title: "Contact"})
  } else {
    req.ParseForm()
    sender := req.Form.Get("email")
    subject := req.Form.Get("subject")
    body := req.Form.Get("body")

    SendContact(sender, subject, body)
    executor.ExecuteTemplate(res, "contact", &Page{Title: "Contact"})
  }
}
func handleTesties(res http.ResponseWriter, req *http.Request) {
  executor.ExecuteTemplate(res, "testies", &Page{Title: "Testimonials"})
}

func main() {
  fs := http.FileServer(http.Dir("static"))
  http.Handle("/static/", http.StripPrefix("/static/", fs))


  if debug {
      executor = DebugTemplateExecutor{templateGlob}

  } else {
      executor = ReleaseTemplateExecutor{
          template.Must(template.ParseGlob(templateGlob)),
      }
  }
  http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
    executor.ExecuteTemplate(w, "testies", nil)
  })


  http.HandleFunc("/", handleAbout)
  http.HandleFunc("/contact", handleContact)
  http.HandleFunc("/hype", handleTesties)
  http.ListenAndServe(":8080", nil)
}
