// pages/login.js
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

export default function Login() {
  const [mode, setMode] = useState("login"); // or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // After signup, user will be created in Firebase Auth. Create a 'users' doc manually in Firestore for role assignment.
        alert(
          "Signed up! Contact IT to set role (admin/teacher/parent) in Firestore 'users' collection."
        );
      }
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">
        {mode === "login" ? "Login" : "Sign up"}
      </h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            type="submit"
          >
            {mode === "login" ? "Login" : "Sign up"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="underline"
          >
            {mode === "login" ? "Create account" : "Have an account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
