"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { User, Mail, Phone, Shield, Camera, Save } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUser(data);
        setFormData({ name: data.name || "", phone: data.phone || "", email: data.email || currentUser.email || "" });
      } else {
        // Fallback for new users
        setFormData({ name: currentUser.displayName || "", phone: "", email: currentUser.email || "" });
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    if (!auth.currentUser) return;
    try {
      const { setDoc, doc } = await import("firebase/firestore");
      await setDoc(doc(db, "users", auth.currentUser.uid), formData, { merge: true });
      setUser({ ...user, ...formData });
      setEditing(false);
    } catch (error) {
      console.error("Update profile error", error);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-10">Account Settings</h1>

      <div className="bg-white rounded-3xl border border-card-border shadow-premium overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-secondary relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
            <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center text-primary border-4 border-white">
              <User size={48} />
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{user?.name}</h2>
              <p className="text-text-secondary">Protected since {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 border border-card-border rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Save size={16} /> Save
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    disabled={!editing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="tel"
                    disabled={!editing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="email"
                  disabled={!editing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary-light/30 p-8 border-t border-card-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl text-primary shadow-sm">
              <Shield size={24} />
            </div>
            <div>
              <h4 className="font-bold text-text-primary">Safety Verification</h4>
              <p className="text-sm text-text-secondary">Your account is verified and linked to emergency services.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
