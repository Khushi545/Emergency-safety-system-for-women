"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, ShieldPlus, AlertCircle } from "lucide-react";
import ContactCard from "@/components/ContactCard";
import AnimatedModal from "@/components/AnimatedModal";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<any>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "contacts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContacts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (data: { name: string; phone: string; email: string }) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      if (editingContact) {
        await updateDoc(doc(db, "users", user.uid, "contacts", editingContact.id), data);
      } else {
        await addDoc(collection(db, "users", user.uid, "contacts"), data);
      }
      setIsModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      console.error("Error saving contact", error);
    }
  };

  const handleEditIntent = (id: string, name: string, phone: string, email: string) => {
    setEditingContact({ id, name, phone, email });
    setIsModalOpen(true);
  };

  const handleDeleteContact = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "contacts", id));
    } catch (error) {
      console.error("Error deleting contact", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Emergency Contacts</h1>
          <p className="text-text-secondary">These contacts will be notified instantly during an SOS.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <UserPlus size={20} /> Add New
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {contacts.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ContactCard
                {...contact}
                onEdit={handleEditIntent}
                onDelete={handleDeleteContact}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && contacts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-card-border">
            <div className="p-4 bg-primary-light rounded-full mb-4">
              <ShieldPlus size={48} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-text-primary">No contacts added</h3>
            <p className="text-text-secondary mb-6">You haven't added any emergency contacts yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-primary font-bold hover:underline"
            >
              Add your first contact now
            </button>
          </div>
        )}

        {contacts.length > 0 && contacts.length < 3 && (
          <div className="flex items-center gap-2 mt-6 p-4 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 italic text-sm">
            <AlertCircle size={18} />
            Tip: We recommend adding at least 3 trusted emergency contacts.
          </div>
        )}
      </div>

      <AnimatedModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingContact}
      />
    </div>
  );
}
