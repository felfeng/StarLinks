/* eslint-disable */

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuth, logOut } from "@/app/lib/firebase/auth";
import { User } from "firebase/auth";

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuth((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="absolute top-0 right-0 p-4">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-text">{user.email}</span>
          <button
            onClick={() => logOut()}
            className="bg-blue hover:bg-blue/80 text-text py-2 px-4 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <Link
          href="/signin"
          className="bg-blue hover:bg-blue/80 text-text py-2 px-4 rounded transition-colors"
        >
          Sign In
        </Link>
      )}
    </nav>
  );
}
