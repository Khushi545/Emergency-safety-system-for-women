"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, Loader2, Image as ImageIcon } from "lucide-react";

interface EvidenceUploaderProps {
  alertId?: string;
}

export default function EvidenceUploader({ alertId }: EvidenceUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<{ url: string; type: "image" }[]>([]);

  const uploadFile = async (blob: Blob) => {
    if (!alertId || !auth.currentUser) return;
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Missing Cloudinary configuration. Please check your .env.local");
      return;
    }

    setUploading(true);
    setProgress(10); 

    try {
      const formData = new FormData();
      formData.append("file", blob, `evidence_${Date.now()}.jpg`);
      formData.append("upload_preset", uploadPreset);
      formData.append("resource_type", "image");
      formData.append("folder", `staysafe/${auth.currentUser.uid}/${alertId}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Cloudinary Upload Failed");

      const result = await response.json();
      const downloadUrl = result.secure_url;
      const timestamp = Date.now();
      
      const alertRef = doc(db, "alerts", alertId);
      await updateDoc(alertRef, {
        evidenceUrls: arrayUnion({ url: downloadUrl, type: "image", timestamp })
      });
      
      setPreviews(prev => [...prev, { url: downloadUrl, type: "image" }]);
      setProgress(100);

      try {
        await fetch("/api/evidence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alertId,
            userId: auth.currentUser.uid,
            evidenceUrl: downloadUrl,
            type: "image"
          }),
        });
      } catch (emailErr) {
        console.error("Failed to send evidence email", emailErr);
      }
    } catch (error) {
      console.error("Upload Error", error);
      alert("Failed to upload evidence. Please check your connection.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) uploadFile(blob);
      }, "image/jpeg");

      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Camera error", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl border border-card-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-text-primary text-xl">Capture Evidence</h3>
        {uploading && (
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={capturePhoto}
          disabled={uploading}
          className="flex flex-col items-center justify-center p-8 bg-primary-light text-primary rounded-2xl border border-primary/20 hover:bg-white transition-all gap-3"
        >
          <Camera size={40} />
          <span className="font-bold text-lg">Take Photo Evidence</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-8 pt-6 border-t border-card-border"
          >
            <h4 className="text-sm font-semibold text-text-secondary mb-4">RECENTLY UPLOADED</h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {previews.map((file, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-20 h-20 rounded-xl bg-gray-50 border border-card-border flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                >
                  <img src={file.url} alt="Evidence" className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5 shadow-sm">
                    <Check size={10} className="text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
