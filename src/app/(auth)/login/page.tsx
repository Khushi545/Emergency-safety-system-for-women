"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Set session cookie for the proxy (middleware)
      const token = await userCredential.user.getIdToken();
      document.cookie = `session=${token}; path=/; max-age=3600; SameSite=Lax`;
      
      router.push("/home");
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
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

          <h1 className="text-2xl font-bold text-center mb-2 text-text-primary">Welcome Back</h1>
          <p className="text-text-secondary text-center mb-8">Sign in to stay protected</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
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

            <div className="space-y-2">
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
                className="text-secondary-dark text-sm text-center font-medium"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center mt-8 text-text-secondary">
            New here?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
