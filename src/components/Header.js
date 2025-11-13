// components/Header.js
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import useUserProfile from "../hooks/useUser";

export default function Header() {
  const { user } = useUserProfile();

  return (
    <header className="bg-green-700 text-white p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <Link href="/">
            <a className="font-bold text-lg">Qab Elias School</a>
          </Link>
        </div>
        <nav className="space-x-4">
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/login">
            <a>Login</a>
          </Link>
          <Link href="/admin">
            <a>Admin</a>
          </Link>
          {user && (
            <button onClick={() => signOut(auth)} className="ml-2 underline">
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
