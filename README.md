# Query Submission Service

This project is a small Node.js HTTP server that accepts a person's name, email
address, and message. It appends each valid submission to `queries.txt` and
attempts to send a confirmation email to the submitted address.

## Requirements

- Node.js and npm

## Run the server

Install the dependencies and start the server:

```sh
npm install
npm start
```

The server listens on port `5000`.

## Submit a query

Send a `POST` request with a JSON body containing string values for `name`,
`email`, and `message`:

```sh
curl -X POST http://localhost:5000/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Rani","email":"rani@example.com","message":"Hello there!"}'
```

A valid submission is appended to `queries.txt`. The server responds with
`Query received`; invalid JSON or missing/non-string fields receive a `400`
response. A failure to save the query receives a `500` response.

## Email behavior

After saving a query, the server attempts to send a confirmation email using
Gmail. A successful send emits the `mailSent` event, which the server logs.
Email delivery is asynchronous and a send failure does not change the
`Query received` response.

Before using this service, configure the Gmail transport with valid credentials
managed outside source control. Do not commit email passwords or app passwords.
If credentials already committed are real, revoke or rotate them.

## Project files

- `index.js` — request handling, file persistence, and email/event behavior.
- `server.js` — starts the HTTP server on port `5000`.
- `queries.txt` — appended query records.
- `upload_project.js` — submission helper; not needed to run the server.
