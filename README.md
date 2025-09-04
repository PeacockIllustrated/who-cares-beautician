
# Who Cares - Beautician Booking App

This is a production-ready, full-stack web application for a beauty salon, built with React, TypeScript, Vite, Tailwind CSS, and a comprehensive Firebase backend.

## Features

### Client-Facing
- **Service Browsing:** View available services and add-ons.
- **Real-time Booking:** Select available slots from a calendar.
- **Booking Management:** View, edit style notes, or cancel upcoming appointments.
- **Out-of-Hours Requests:** Request appointments outside of standard availability.
- **Waiting List:** Join a waiting list for a fully booked day.
- **PWA Support:** Installable on mobile devices with offline capabilities.

### Admin Dashboard
- **KPI Overview:** Key metrics at a glance.
- **Appointment Management:** View and manage all upcoming and past appointments.
- **Request Management:** Approve or deny out-of-hours requests.
- **Waiting List Management:** Notify clients on the waiting list.
- **Services CRUD:** Full control over services, pricing, and visibility.
- **Availability Tools:** Set weekly recurring availability and manage one-off dates.
- **Client CRM:** View client history and add internal notes.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Firebase (Authentication, Firestore, Cloud Functions)
- **State Management:** React Hooks & Context
- **PWA:** `vite-plugin-pwa` for service worker and manifest generation

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
    - Create a `.env.local` file in the root directory for local development.
    - Add your Firebase config keys to it, prefixed with `VITE_`:
      ```
      VITE_FIREBASE_API_KEY="AIza..."
      VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
      VITE_FIREBASE_PROJECT_ID="your-project"
      VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
      VITE_FIREBASE_MESSAGING_SENDER_ID="12345..."
      VITE_FIREBASE_APP_ID="1:12345...:web:..."
      VITE_FIREBASE_MEASUREMENT_ID="G-..."
      ```
    - The app has a hardcoded fallback config for initial setup, but using environment variables is required for deployment.

6.  **Configure Firebase CLI:**
    - Log in to Firebase: `firebase login`
    - Set the active project: `firebase use your-project-id`

7.  **Seed Initial Data (Optional but Recommended):**
    - To use the admin panel, you need to be designated as an admin. Manually add a document in your Firestore database:
        - Collection: `_internal`
        - Document ID: `adminConfig`
        - Field: `adminUids` (Type: `array`)
        - Value: Add your Firebase Auth UID as a string in the array.

8.  **Run with Firebase Emulators:**
    - This is the best way to develop locally.
    ```sh
    firebase emulators:start
    ```
    - In a separate terminal, run the Vite dev server:
    ```sh
    npm run dev
    ```
    - The app will be running on `http://localhost:5173` and connected to the local emulators.

## Deployment

### 1. Build the Application
```sh
npm run build
```

### 2. Deploy to Hosting (Firebase, Netlify, etc.)
You can deploy the `dist` folder to any static hosting provider. For Firebase Hosting:
```sh
firebase deploy --only hosting
```

### 3. Deploy Firebase Rules & Functions
```sh
firebase deploy --only firestore,functions
```

### 4. CRITICAL: Post-Deployment Configuration

**A) Set Environment Variables:**
- In your hosting provider's dashboard (e.g., Netlify, Vercel), you **must** set the same `VITE_FIREBASE_*` environment variables that you used in your `.env.local` file. The build process will use these to configure the app.

**B) Authorize Your Domain:**
- The `auth/configuration-not-found` error occurs because Firebase Authentication, by default, only allows sign-ins from `localhost` and your authorized Firebase Hosting domains for security.
- Go to your **Firebase Console**.
- Navigate to **Authentication** -> **Settings** -> **Authorized domains**.
- Click **Add domain** and enter the domain where your app is hosted (e.g., `your-site-name.netlify.app`).
- **This step is mandatory for Google Sign-In to work on your live site.**
