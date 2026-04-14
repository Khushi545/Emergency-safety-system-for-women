"use client";

import { motion } from "framer-motion";
import { User, Phone, Mail, Trash2, Edit2, PhoneCall } from "lucide-react";

interface ContactCardProps {
  id: string;
  name: string;
  phone: string;
  email: string;
  onEdit: (id: string, name: string, phone: string, email: string) => void;
  onDelete: (id: string) => void;
}

export default function ContactCard({ id, name, phone, email, onEdit, onDelete }: ContactCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-card w-full p-5 rounded-2xl border border-card-border shadow-sm flex items-center justify-between group hover:shadow-premium transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary">
          <User size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">{name}</h3>
          <div className="flex flex-col text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <Phone size={14} className="opacity-70" /> {phone}
            </span>
            <span className="flex items-center gap-1">
              <Mail size={14} className="opacity-70" /> {email}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <a
          href={`tel:${phone}`}
          className="p-2 text-primary hover:bg-primary-light rounded-xl transition-all"
          title="Call Contact"
        >
          <PhoneCall size={20} />
        </a>
        <button
          onClick={() => onEdit(id, name, phone, email)}
          className="p-2 text-text-secondary hover:text-primary hover:bg-primary-light rounded-xl transition-all"
          title="Edit Contact"
        >
          <Edit2 size={20} />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-2 text-text-secondary hover:text-secondary-dark hover:bg-secondary/10 rounded-xl transition-all"
          title="Delete Contact"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </motion.div>
  );
}
