<div align="center">

# 🚀 NextGen Analytics

### AI-Powered Agency Systems · Data Analytics · Business Intelligence · Automation

**Turning messy data into profit-driving insights — one dashboard at a time.**

[![Website](https://img.shields.io/badge/🌐_Live_Website-2EA3F2?style=for-the-badge)](https://nextgen-analytics-delta.vercel.app)
[![Portfolio](https://img.shields.io/badge/👤_Founder_Portfolio-000000?style=for-the-badge)](https://affaf12.github.io)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/muhammadaffaf/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:muhammadaffaf746@gmail.com)

</div>

---

## ✨ What is NextGen Analytics?

**NextGen Analytics** is a solo-founded AI & data analytics agency based in Karachi, Pakistan 🇵🇰.

We help businesses stop drowning in spreadsheets and start making decisions from **clean, interactive, AI-powered dashboards**. From Power BI storytelling to LLM automation, WhatsApp outreach, and custom SaaS tools — we build end-to-end systems that save time and drive revenue.

> 🎯 **Our mission:** Make world-class data analytics and AI automation accessible to growing businesses.

---

## 🧩 What's Inside This Repository

This repo contains the **public-facing site and API** for NextGen Analytics.

| Folder | Description |
|---|---|
| 📁 `frontend-public/` | Client-facing website built with **React + Vite** |
| 📁 `backend/` | **FastAPI** API — powered by Postgres in production |

> 🔒 **Note:** The Admin Panel is intentionally **not** part of this repository.

---

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

---

## 🚀 Local Run

### 1️⃣ Backend (FastAPI)

```bash
cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
cp .env.example .env && uvicorn app.main:app --reload
