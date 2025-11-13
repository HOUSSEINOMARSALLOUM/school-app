// hooks/useUser.js
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function useUserProfile() {
  const [user, loading, error] = useAuthState(auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!mounted) return;
        if (snap.exists()) setProfile(snap.data());
        else setProfile({ email: user.email, role: "parent" });
      } catch (err) {
        console.error("error fetching profile:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  return { user, profile, loading, error };
}
