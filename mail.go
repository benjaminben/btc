package main

import(
  "keys/btc_keys"
  "log"
  "net/smtp"
)

const emailAdd string = btc_keys.EmailAdd
const emailPass string = btc_keys.EmailPass

func SendContact(sender string, subject string, body string, res string) {
  log.Printf("incoming contact: %s; %s; %s", sender, subject, body)
  admin := emailAdd
  password := emailPass

  msg := "" +
    "Subject: " + subject + "\r\n\r\n" +
    "Sender: " + sender + "\r\n" +
    "Message: " + body + "\r\n"

  auth := smtp.PlainAuth(
    "",
    admin,
    password,
    "smtp.gmail.com",
  )
  err := smtp.SendMail(
    "smtp.gmail.com:587",
    auth,
    admin,
    []string{admin},
    []byte(msg),
  )
  if err != nil {
    log.Printf("Error: %s", err)
    return
  }

  SendContactConf(sender, subject, res)
  log.Print("contact sent")
}

func SendContactConf(to string, subject string, body string) {
  from := emailAdd
  password := emailPass

  msg := "" +
    "From: " + from + "\r\n" +
    "To: " + to + "\r\n" +
    "Subject: " + subject + "\r\n\r\n" +
    body + "\r\n"

  auth := smtp.PlainAuth(
    "",
    from,
    password,
    "smtp.gmail.com",
  )
  err := smtp.SendMail(
    "smtp.gmail.com:587",
    auth,
    from,
    []string{to},
    []byte(msg),
  )
  if err != nil {
    log.Printf("Error: %s", err)
    return
  }

  log.Print("message sent")
}
