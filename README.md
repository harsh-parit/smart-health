# 🏥 JanArogya AI

<div align="center">

### AI-Powered Public Health Intelligence Platform

**Built for Google Cloud Build with AI: Code for Communities Hackathon 2026**

Empowering **Citizens, ASHA Workers, Doctors, and District Health Officers** through one intelligent healthcare ecosystem powered by **Google Gemini AI** and **Firebase**.

---

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange?logo=firebase)
![Gemini](https://img.shields.io/badge/Google-Gemini-blue?logo=google)
![Material Design](https://img.shields.io/badge/Material-Design%203-green)
![Hackathon](https://img.shields.io/badge/Google-Code%20for%20Communities-red)

</div>

---

# 🌍 Problem Statement

Rural healthcare systems often face:

- Delayed diagnosis
- Manual field reporting
- Fragmented patient records
- Poor coordination between healthcare workers
- Limited district-level healthcare intelligence

JanArogya AI addresses these challenges by creating a connected AI-powered healthcare ecosystem.

---

# 💡 Solution

JanArogya AI is an intelligent public healthcare platform that connects every layer of rural healthcare.

```
Citizen
      │
      ▼
Gemini AI Symptom Analysis
      │
      ▼
Firestore
      │
      ▼
ASHA Worker Verification
      │
      ▼
Doctor Consultation
      │
      ▼
District Health Intelligence
```

The platform enables real-time healthcare collaboration while providing AI-assisted decision support and district-wide public health insights.

---

# 🚀 Key Features

## 👤 Citizen Portal

- AI-powered symptom reporting
- Medical history submission
- Prescription upload
- AI-generated health assessment
- Report history
- Emergency assistance

---

## 👩‍⚕️ ASHA Worker Console

- Patient registration
- Home visit management
- Risk verification
- Referral management
- Community healthcare support

---

## 🩺 Doctor Command Center

- Patient queue
- AI-assisted consultation
- SOAP Notes generation
- Referral workflow
- Clinical documentation

---

## 🏥 District Health Intelligence

- Real-time health analytics
- Disease surveillance
- Healthcare trends
- High-risk alerts
- Resource planning
- Public health insights

---

# 🤖 AI Capabilities

Powered by **Google Gemini**

- Symptom Analysis
- Patient Summary Generation
- Risk Classification
- Doctor Handoff Summary
- SOAP Notes Assistance
- AI Operational Insights

> **Important:** AI assists healthcare professionals and does **not** replace medical diagnosis or clinical judgment.

---

# ⚙️ Technology Stack

| Category | Technology |
|-----------|------------|
| Frontend | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + Material Design 3 |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| AI | Google Gemini API |
| Hosting | Firebase Hosting |
| Version Control | GitHub |

---

# 🏗️ Architecture

```
React Application

        │

Firebase Authentication

        │

Cloud Firestore

        │

Google Gemini AI

        │

Role-Based Dashboards

        │

Citizen
ASHA
Doctor
District Officer
```

---

# 🔐 Role-Based Access

The application provides secure role-based access control.

- 👤 Citizen
- 👩‍⚕️ ASHA Worker
- 🩺 Doctor
- 🏥 District Health Officer

Each user has access only to their authorized dashboard.

---

# 📂 Project Structure

```
src/

├── components/
├── contexts/
├── features/
│   ├── citizen/
│   ├── doctor/
│   ├── dho/
│   ├── landing/
│   └── demo/
├── hooks/
├── services/
├── layouts/
├── pages/
├── utils/
├── types/
├── constants/
└── assets/
```

---

# 🔄 Application Workflow

```
Citizen Reports Symptoms
            │
            ▼
Gemini AI Analysis
            │
            ▼
Health Report Generated
            │
            ▼
Saved to Firestore
            │
            ▼
ASHA Worker Review
            │
            ▼
Doctor Consultation
            │
            ▼
SOAP Notes
            │
            ▼
District Analytics Updated
```

---

# 📸 Screenshots

> Add screenshots here after deployment.

- Landing Page
- Citizen Dashboard
- ASHA Dashboard
- Doctor Dashboard
- District Dashboard
- AI Health Report
- Analytics Dashboard

---

# 🛠️ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/janarogya-ai.git
```

Go inside the project

```bash
cd janarogya-ai
```

Install dependencies

```bash
npm install
```

Create environment variables

```env
VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=

VITE_FIREBASE_MEASUREMENT_ID=

VITE_GEMINI_API_KEY=
```

Run locally

```bash
npm run dev
```

---

# 🔐 Environment Variables

The project uses secure environment variables.

```
VITE_FIREBASE_API_KEY

VITE_FIREBASE_AUTH_DOMAIN

VITE_FIREBASE_PROJECT_ID

VITE_FIREBASE_STORAGE_BUCKET

VITE_FIREBASE_MESSAGING_SENDER_ID

VITE_FIREBASE_APP_ID

VITE_FIREBASE_MEASUREMENT_ID

VITE_GEMINI_API_KEY
```

---

# 🎯 Hackathon Theme Alignment

This project addresses:

- AI for Public Healthcare
- Rural Healthcare Accessibility
- Community Health Intelligence
- Healthcare Workforce Support
- Data-Driven Governance

---

# 📈 Future Enhancements

- Voice-based symptom reporting
- Prescription OCR
- Predictive disease outbreak detection
- Multilingual support
- Offline-first capability
- Wearable device integration
- Telemedicine integration

---

# 👨‍💻 Developed By

**Harsh Rakesh Parit**

BCA Final Year Student

Google Build with AI – Code for Communities Hackathon 2026

---

# 📄 License

This project is developed for educational and hackathon purposes.

---

<div align="center">

### ❤️ Building AI for Better Community Healthcare

**JanArogya AI**

*Connecting Communities. Empowering Healthcare.*

</div>