"use client";
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
};

export default function Modal({ open, onClose, title, children, actions }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Overlay azul com blur */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-blue-100/70 to-blue-200/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          {/* Painel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-blue-100/70 p-6"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {title && (
              <div className="mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">✨</div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
            )}
            <div className="text-sm text-gray-700">
              {children}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              {actions}
              <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50">Fechar</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
