"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set session cookie for the proxy (middleware)
      const token = await user.getIdToken();
      document.cookie = `session=${token}; path=/; max-age=3600; SameSite=Lax`;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        phone,
        createdAt: new Date().toISOString(),
      });

      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-card p-8 rounded-2xl border border-card-border shadow-premium"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary-light rounded-full">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 text-text-primary">Create Account</h1>
          <p className="text-text-secondary text-center mb-8">Join StaySafe for personal protection</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-secondary-dark text-sm text-center font-medium py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-text-secondary text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
