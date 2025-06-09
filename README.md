# simple-notes
# 📝 Simple Notes

An AI-powered note-taking app that lets users create, edit, and save notes — manually or with the help of Gemini. Built with the MERN stack and deployed to production with Vercel and Render.

## 🚀 Demo

Frontend: [Live on Vercel](https://simple-notes-lq6329lhr-david-ejindus-projects.vercel.app)  
Backend: [Live on Render](https://simple-notes-thf3.onrender.com)

---

## 🧰 Tech Stack

- **Frontend:** React, Tailwind CSS, DaisyUI, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT (cookie-based)
- **AI Integration:** Gemini API (Google Generative Language)
- **Security:** Upstash Redis (rate limiting), DOMPurify (XSS protection)
- **Deployment:** Vercel (frontend) + Render (backend)

---

## 🔑 Features

- 🔐 Secure registration, login, and logout with JWT cookies  
- 📝 Create, edit, and delete notes tied to authenticated users  
- 🤖 Generate and edit notes using AI (Gemini API) via natural language prompts  
- 🧼 Live markdown preview with `marked` + `DOMPurify` sanitization  
- ⚠️ Rate-limited requests to protect against spam (Upstash)  
- 🧭 Responsive UI styled with Tailwind and DaisyUI  
