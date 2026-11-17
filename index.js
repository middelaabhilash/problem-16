import http from "http";
import fs from "fs";
import EventEmitter from "events";
import nodemailer from "nodemailer";

class CustomEvent extends EventEmitter {
  mailSent(email) {
    this.emit("mailSent", email);
  }
}

const customEvent = new CustomEvent();

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      let query;
      try {
        query = JSON.parse(data);
      } catch (error) {
        res.statusCode = 400;
        res.end("Invalid JSON");
        return;
      }

      const { name, email, message } = query ?? {};

      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string"
      ) {
        res.statusCode = 400;
        res.end("Query must include name, email, and message");
        return;
      }

      const queryString = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\n`;
      fs.appendFile("queries.txt", queryString, (error) => {
        if (error) {
          console.error("Failed to save query:", error);
          res.statusCode = 500;
          res.end("Failed to save query");
          return;
        }

        const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
        const transporter = nodemailer.createTransport({
         service: "gmail",
           auth: {
             user: "codingninjas2k16@gmail.com",
              pass: "slwvvlczduktvhdj",
  },
});

        transporter.sendMail(
          {
            from: GMAIL_USER,
            to: email,
            subject: "Query received",
            text: "We have received your query and will get back to you soon.",
          },
          (mailError) => {
            if (mailError) {
              console.error("Failed to send confirmation email:", mailError);
              return;
            }
            customEvent.mailSent(email);
          }
        );

        res.end("Query received");
      });
    });
  } else {
    res.end("Welcome to Coding Ninjas!");
  }
});

const Solution = () => {
  customEvent.addListener("mailSent", (email) => {
    console.log("custom event 'mailSent' emitted");
    console.log(
      `confirming that the email has been sent successfully to ${email}`
    );
  });
};

export default server;
export { server, CustomEvent, Solution };
