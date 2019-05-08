package main

import(
  "fmt"
  "net/http"
  "html/template"
  "io"
  "log"
  "encoding/json"
)

type Contact struct {
  Sender string
  Subject string
  Body string
}

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
    decoder := json.NewDecoder(req.Body)
    var c Contact
    err := decoder.Decode(&c)
    if err != nil {
      log.Printf("Error: %s", err)
      http.Error(res, err.Error(), 500)
      return
    }

    sender := c.Sender
    subject := c.Subject
    body := c.Body

    confMsg := fmt.Sprintf("" +
    "Hi there, thanks for reaching out!\r\n" +
    "Please expect a human response shortly; meanwhile, enjoy these sound quotes on learning:\r\n\r\n\r\n" +
    "\"An investment in knowledge pays the best interest.\" - Benjamin Franklin\r\n\r\n" +
    "\"Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning.\" - Albert Einstein\r\n\r\n" +
    "\"Knowing is not enough, we must apply. Willing is not enough, we must do.\" - Bruce Lee\r\n\r\n\r\n" +
    "*** This Is An Automated Response To: ***\r\n" +
    "Address: %s\r\n" +
    "Subject: %s\r\n" +
    "Body: %s\r\n", sender, subject, body)

    SendContact(sender, subject, body, confMsg)
    res.WriteHeader(http.StatusOK)
 	  res.Write([]byte("☄ HTTP status code returned!"))
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

  http.HandleFunc("/", handleAbout)
  http.HandleFunc("/contact", handleContact)
  http.HandleFunc("/hype", handleTesties)
  http.ListenAndServe(":7000", nil)
}
