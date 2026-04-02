Berikut versi **lebih teknikal, clean, dan profesional** untuk `design.md` kamu 👇

---

# 📘 Design Document

## Frontend Input App – BLK Training

---

## 1. Overview

A lightweight web application designed to collect training participant (BLK) data without requiring user authentication.

The system prioritizes:

* Low friction data submission (no login)
* Simplicity in UI/UX
* Basic security hardening at the backend layer

---

## 2. Scope

### In Scope

* Public form for student data input
* Server-side request forwarding to external API
* Basic validation (client + server)
* Security middleware integration

### Out of Scope (for now)

* Authentication / Authorization
* Role-based access control
* Data persistence (handled by external API)

---

## 3. Architecture

### High-Level Flow

```text
Client (Browser)
   ↓
EJS Template (Server-side rendered)
   ↓
Express Server
   ↓
External API (Configured via .env)
```

### Request Lifecycle

1. Client loads form page (`GET /`)
2. User submits form (`POST /submit`)
3. Server:

   * Validates payload
   * Injects `app_key`
   * Forwards request to external API
4. Response handling:

   * Success → render success page
   * Error → render error page

---

## 4. Tech Stack

### Frontend Layer

* Template Engine: EJS
* Markup: HTML5
* Styling: CSS (no framework)
* Scripting: Vanilla JavaScript (optional)

### Backend Layer

* Runtime: Node.js
* Framework: Express.js

### Middleware

* `helmet` → Secure HTTP headers
* `cors` → Cross-origin control
* `morgan` → HTTP request logging
* `express-rate-limit` → Traffic throttling

---

## 5. Configuration Management

Environment variables are used to externalize sensitive and environment-specific configuration.

```env
APP_KEY=your_secret_key
API_ENDPOINT=https://api.example.com/input
PORT=3000
```

### Notes

* `APP_KEY` must never be exposed to the client
* All API communication must be routed through the backend

---

## 6. Routing Design

| Method | Endpoint  | Description            |
| ------ | --------- | ---------------------- |
| GET    | `/`       | Render input form      |
| POST   | `/submit` | Handle form submission |

---

## 7. Data Flow

### Input Payload (Client → Server)

```json
{
  "name": "string",
  "identifier": "string",
  "program": "string",
  "date": "YYYY-MM-DD",
  "notes": "string (optional)"
}
```

### Forwarded Payload (Server → API)

```json
{
  "app_key": "string",
  "name": "string",
  "identifier": "string",
  "program": "string",
  "date": "YYYY-MM-DD",
  "notes": "string"
}
```

---

## 8. Validation Strategy

### Client-side Validation

* Required fields must be filled
* Basic format validation (date, text length)

### Server-side Validation

* Re-validation of all required fields
* Input sanitization (prevent injection)
* Reject malformed payloads

---

## 9. Security Considerations

### 9.1 Rate Limiting

Applied globally to prevent abuse.

Example configuration:

```js
windowMs: 15 * 60 * 1000
max: 100
```

---

### 9.2 HTTP Security Headers

Using `helmet` to enforce:

* XSS protection
* Clickjacking protection
* MIME sniffing prevention

---

### 9.3 CORS Policy

Restrict API access:

* Allow only trusted origins (configurable)

---

### 9.4 Secret Handling

* `APP_KEY` stored in `.env`
* Injected only at server level
* Never exposed via frontend or HTML

---

## 10. Error Handling

### API Failure

* Return fallback error page
* Log error details via `morgan` or console

### Validation Failure

* Reject request early
* Optionally re-render form with error message

---

## 11. View Structure (EJS)

| File          | Purpose                 |
| ------------- | ----------------------- |
| `index.ejs`   | Input form UI           |
| `success.ejs` | Submission success page |
| `error.ejs`   | Error feedback page     |

---

## 12. Project Structure

```text
project-root/
│
├── views/
│   ├── index.ejs
│   ├── success.ejs
│   └── error.ejs
│
├── public/
│   ├── css/
│   └── js/
│
├── routes/
│   └── index.js
│
├── middleware/
│
├── app.js
├── .env
└── package.json
```

---

## 13. Future Enhancements

* Client-side UX improvements (loading state, feedback UI)
* CAPTCHA integration (if abuse detected)
* Structured logging (Winston / external service)
* Request schema validation (e.g. Joi / Zod)
* Retry mechanism for API failures

---

## 14. Design Principles

* **Minimal surface area** → reduce attack vectors
* **Backend-controlled secrets** → no client exposure
* **Stateless interaction** → no session dependency
* **Fail fast validation** → reject invalid input early

---

