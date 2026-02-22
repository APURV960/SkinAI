# 🌿 SkinAI Advisor

AI-powered skin analysis web application that evaluates uploaded skin images and provides risk-level assessment with treatment guidance.

## 🚀 Overview

SkinAI Advisor allows users to upload a clear image of their skin and receive an AI-driven assessment within seconds. The system uses computer vision techniques combined with generative AI workflows to analyze visual patterns such as texture, discoloration, and lesion characteristics.

It is designed as a **pre-screening tool**, helping users understand whether basic care is sufficient or if professional consultation may be required.

> ⚠️ This application does not provide medical diagnoses. It is intended for informational purposes only.

---

## ✨ Features

* 📸 Image upload (PNG, JPG, WEBP)
* ⚡ Real-time AI analysis
* 🧠 Risk-level classification
* 💡 Treatment guidance suggestions
* 🔐 Firebase Authentication
* 🕒 Analysis history storage
* ❤️ Saved product recommendations

---

## 🏗️ Tech Stack

* **Frontend:** Next.js, TypeScript
* **AI Orchestration:** Google Genkit
* **AI Capabilities:** Generative AI, Computer Vision
* **Backend & Database:** Firebase (Auth, Firestore, Storage)
* **Styling:** TailwindCSS
---

## 🧠 How It Works

1. User uploads a clear, well-lit skin image.
2. Image is stored securely in Firebase Storage.
3. Image is processed by computer vision models.
4. Extracted features are passed into a Genkit-powered AI workflow.
5. AI returns:
   * Possible condition category
   * Risk level
   * Treatment guidance
6. Results and history are saved in Firestore.
7. User views results instantly.

---

## 📦 Installation

```bash
git clone https://github.com/your-username/skinai-advisor.git
cd skinai-advisor
npm install
npm run dev
```

---

## 🖼️ UI Preview

<img width="1901" height="891" alt="image" src="https://github.com/user-attachments/assets/ed60fc13-67da-460f-9cba-0e2bceba197b" />


---
