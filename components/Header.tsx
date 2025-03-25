"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-white shadow-lg backdrop-blur-sm sticky top-0 z-50">
      <nav className="flex justify-between items-center max-w-4xl mx-auto p-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
          >
            ToDo
          </Link>
        </motion.div>
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white font-extrabold bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Link href="/profile">Profile</Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  signOut(auth);
                  toast.success("Logged out");
                }}
                className="text-white font-extrabold bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white font-extrabold bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Link href="/auth">Login</Link>
            </motion.button>
          )}
        </div>
      </nav>
    </header>
  );
}
