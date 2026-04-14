"use client";

import { useState } from "react";
import { Download, FileText, Image as ImageIcon, FileSpreadsheet, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import Papa from "papaparse";
import { jsPDF } from "jspdf";

interface ExportButtonProps {
  data?: any[];
  filename?: string;
  chartRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ExportButton({ data, filename = "analytics-export", chartRef }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = () => {
    if (!data) return;
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const exportPNG = async () => {
    if (!chartRef?.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.png`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export PNG Error", err);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const exportPDF = async () => {
    if (!chartRef?.current && !data) return;
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Analytics Report", 10, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 30);

      if (chartRef?.current) {
        const canvas = await html2canvas(chartRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 40, 190, 100);
      }

      doc.save(`${filename}.pdf`);
    } catch (err) {
      console.error("Export PDF Error", err);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
      >
        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        <span>Export</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-card-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {data && (
              <button
                onClick={exportCSV}
                className="w-full text-left px-4 py-3 text-sm hover:bg-primary-light transition-colors flex items-center gap-2 text-text-primary"
              >
                <FileSpreadsheet size={16} className="text-emerald-500" />
                <span>Export as CSV</span>
              </button>
            )}
            {chartRef && (
              <button
                onClick={exportPNG}
                className="w-full text-left px-4 py-3 text-sm hover:bg-primary-light transition-colors flex items-center gap-2 text-text-primary"
              >
                <ImageIcon size={16} className="text-blue-500" />
                <span>Export as Image</span>
              </button>
            )}
            <button
              onClick={exportPDF}
              className="w-full text-left px-4 py-3 text-sm hover:bg-primary-light transition-colors flex items-center gap-2 text-text-primary"
            >
              <FileText size={16} className="text-rose-500" />
              <span>Export as PDF</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
