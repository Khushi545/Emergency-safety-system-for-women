"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, Plus, Save } from "lucide-react";

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; email: string }) => void;
  initialData?: { name: string; phone: string; email: string } | null;
}

export default function AnimatedModal({ isOpen, onClose, onSubmit, initialData }: AnimatedModalProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: "", phone: "", email: "" });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", phone: "", email: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-8 z-[101] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text-primary">
                {initialData ? "Edit Emergency Contact" : "Add Emergency Contact"}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Contact Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
              >
                {initialData ? (
                  <>
                    <Save size={24} /> Save Changes
                  </>
                ) : (
                  <>
                    <Plus size={24} /> Add Contact
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
