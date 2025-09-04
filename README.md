
# Who Cares - Beautician Booking App

This is a production-ready, full-stack web application for a beauty salon, built with a simplified and robust structure using React, TypeScript, Vite, Tailwind CSS, and a comprehensive Firebase backend.

## Features

- **Simplified Architecture:** A flat, easy-to-understand structure perfect for getting started and deploying quickly.
- **Role-Based Views:** A single homepage that intelligently displays either a client or admin dashboard after login.
- **Client Dashboard:** View booking history.
- **Admin Dashboard:** Placeholder for admin-specific functionality.
- **Secure Authentication:** Google Sign-In with secure, server-enforced admin roles.
- **PWA Ready:** The app is fully installable on mobile devices.
- **Server-Side Logic:** Critical operations like booking and cancellation are handled by secure Firebase Cloud Functions.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Firebase (Authentication, Firestore, Cloud Functions)
- **State Management:** React Hooks & Context API

## Prerequisites

- Node.js (v20 or later)
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project

## Local Setup & Running with Emulators

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install root dependencies:**
    ```sh
    npm install
    ```

3.  **Install Cloud Functions dependencies:**
    ```sh
    cd functions
    npm install
    cd ..
    ```

4.  **Set up Firebase Project:**
    - Create a project on the [Firebase Console](https://console.firebase.google.com/).
    - Enable Authentication (Google Sign-In), Firestore, and Functions.
    - Go to Project Settings -> General, and register a new web app.
    - Copy the `firebaseConfig` object.

5.  **Environment Variables:**
    - Create a `.env.local` file in the root directory.
    - Copy the contents of `.env.example` and fill in your Firebase project details. These are essential.

6.  **Configure Admin User:**
    - To use the admin panel, you must designate an admin user. After signing in with your app at least once, go to your Firestore database:
        - Collection: `_internal` -> Document: `adminConfig`
        - Create a field `adminUids` of type `array`.
        - Add your Firebase Auth UID as a string to this array.

7.  **Run with Firebase Emulators:**
    - This is the best way to develop locally. Start the emulators:
    ```sh
    firebase emulators:start
    ```
    - In a **new terminal**, run the Vite dev server:
    ```sh
    npm run dev
    ```
    - The app will run on `http://localhost:5173` and connect to the local emulators automatically.

## Deployment Guide

1.  **Build the Application:**
    ```sh
    npm run build
    ```
    This creates a `dist` folder ready for hosting.

2.  **Deploy Firebase Components:**
    ```sh
    firebase deploy --only firestore,functions
    ```

3.  **Deploy to Hosting (Netlify, Vercel, Firebase Hosting):**
    - **Set Environment Variables:** In your hosting provider's dashboard (e.g., Netlify), you **must** set the same `VITE_FIREBASE_*` environment variables from your `.env.local` file.
    - **Deploy the `dist` folder.**

---

### **CRITICAL: Authorize Your Live Domain**

This is the most common reason for login failures on a deployed site.

- **Why?** For security, Firebase Authentication blocks sign-in attempts from unknown domains.
- **How to Fix:**
    1.  Go to your **Firebase Console**.
    2.  Navigate to **Authentication** -> **Settings** -> **Authorized domains**.
    3.  Click **Add domain** and enter your live URL (e.g., `your-app.netlify.app`).

**Your app will not work without this step.**

---
