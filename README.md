
<p align="center">
  <img src="Front-end/images/herrestartAI.png" alt="HerRestartAI Banner" width="100%">
</p>

<h1 align="center">
🌸 HerRestartAI
</h1>

<h3 align="center">
AI-Powered Financial Recovery Assistant
</h3>

<p align="center">
Helping women rebuild financial confidence through personalized AI-powered guidance.
</p>

<p align="center">

<img src="https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python"/>
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi"/>
<img src="https://img.shields.io/badge/Google-Gemini-orange?style=for-the-badge&logo=google"/>
<img src="https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
<img src="https://img.shields.io/badge/HTML5-CSS3-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
<img src="https://img.shields.io/badge/ElevenLabs-Voice_AI-purple?style=for-the-badge"/>

</p>

---

# 🌟 Overview

Financial planning tools often assume stable income, predictable expenses, and straightforward financial goals. However, many women experiencing major life transitions—such as divorce, single parenthood, career breaks, or financial hardship—require personalized guidance tailored to their unique circumstances.

**HerRestartAI** is an AI-powered financial recovery assistant that transforms a user's financial profile into an actionable recovery strategy using Large Language Models. The platform generates personalized budgeting recommendations, debt reduction plans, savings strategies, and a structured financial roadmap while also providing voice-based explanations for an accessible and supportive experience.

---

# 🚀 Features

✅ Personalized AI-generated financial recovery plans

✅ Monthly budgeting recommendations

✅ Financial Stability Score

✅ Debt payoff timeline estimation

✅ Emergency savings strategy

✅ 30-day action plan

✅ Six-month financial roadmap

✅ Interactive dashboard

✅ Voice-enabled AI assistant using ElevenLabs

---

# 💡 Problem Statement

Many budgeting applications provide generic advice without considering individual financial situations.

Women facing significant life transitions often need:

- Personalized budgeting
- Debt management guidance
- Savings prioritization
- Clear recovery planning
- Easy-to-understand explanations

HerRestartAI bridges this gap by converting complex financial information into practical and actionable recommendations powered by AI.

---

# 🏗️ System Architecture

```text
                  User Financial Profile
                            │
                            ▼
                Frontend (HTML/CSS/JavaScript)
                            │
                            ▼
                     FastAPI Backend
                            │
                            ▼
               Google Gemini API (LLM)
                            │
                            ▼
          Structured Financial Recommendation
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
     Interactive Dashboard         ElevenLabs TTS
             │                             │
             └──────────────┬──────────────┘
                            ▼
                  Personalized User Experience
````

---

# ⚙️ How It Works

### Step 1

The user enters financial information such as:

* Monthly income
* Housing expenses
* Existing debt
* Savings
* Dependents
* Financial goals

↓

### Step 2

The frontend sends the information to a FastAPI backend.

↓

### Step 3

The backend uses prompt engineering to query Google Gemini.

↓

### Step 4

Gemini generates structured financial recommendations.

↓

### Step 5

The response is parsed into:

* Budget allocation
* Debt repayment strategy
* Savings recommendations
* Priority action items

↓

### Step 6

The dashboard visualizes insights while ElevenLabs generates a natural voice explanation.

---

# 📊 Example Outputs

The platform generates personalized insights including:

| Feature         | Output                     |
| --------------- | -------------------------- |
| Budget Plan     | Monthly allocation         |
| Stability Score | Financial health indicator |
| Debt Timeline   | Estimated payoff duration  |
| Savings Plan    | Monthly savings target     |
| Action Plan     | 30-day roadmap             |
| Recovery Plan   | Six-month strategy         |

---

# 🛠️ Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript

## Backend

* Python
* FastAPI

## AI

* Google Gemini API
* Prompt Engineering

## Voice AI

* ElevenLabs API

## Communication

* REST APIs
* JSON

---

# 📂 Project Structure

```text
HerRestartAI
│
├── frontend
│     ├── index.html
│     ├── style.css
│     └── script.js
│
├── backend
│     ├── app.py
│     ├── routes.py
│     └── services
│
├── prompts
│
├── assets
│
├── requirements.txt
│
└── README.md
```

---

# 🎯 Technical Highlights

* Large Language Model integration
* Prompt engineering
* REST API development
* Structured JSON parsing
* Dynamic frontend rendering
* Voice AI integration
* AI-assisted decision support system

---

# 📈 Future Enhancements

* User authentication
* Financial goal tracking
* Expense visualization charts
* Banking API integration
* Investment recommendations
* Multi-language support
* Downloadable PDF reports
* Personalized notifications

---

# 🎓 Learning Outcomes

This project demonstrates practical experience with:

* Generative AI applications
* Full-stack development
* API orchestration
* AI product design
* Financial analytics
* User-centered system design
* Voice-enabled AI experiences

---

# 👩‍💻 Team

Built with the vision of making personalized financial guidance more accessible, empathetic, and actionable through AI.

---

# ⭐ If you found this project interesting, consider giving it a Star!

```
```
