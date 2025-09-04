import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import Button from '../../components/ui/Button';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create a client profile if it doesn't exist
      const clientRef = doc(db, 'clients', user.uid);
      const clientSnap = await getDoc(clientRef);

      if (!clientSnap.exists()) {
        await setDoc(clientRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-xl shadow-soft">
        <div>
          <h1 className="text-3xl font-bold text-center text-primary">Who Cares</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to book your appointment
          </p>
        </div>
        <div className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;