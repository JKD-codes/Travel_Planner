'use client';

import React, { useState } from 'react';
import { TravelDocument } from '../types/trip';
import { FileText, X } from 'lucide-react';

interface TravelDocumentsModalProps {
  documents: TravelDocument[];
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: TravelDocument) => void;
}

export default function TravelDocumentsModal({
  documents,
  isOpen,
  onClose,
  onAddDocument,
}: TravelDocumentsModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TravelDocument['category']>('Hotel Voucher');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    onAddDocument({
      id: `doc-${Date.now()}`,
      title: title.trim(),
      category,
      confirmationCode: confirmationCode.trim(),
      fileType: 'Electronic Voucher / PDF',
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    });
    setTitle('');
    setConfirmationCode('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Travel Documents & Bookings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Store vouchers, e-tickets, and confirmation numbers</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Documents List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {documents?.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No documents saved yet. Add your first travel ticket or hotel voucher below.
            </div>
          ) : (
            documents?.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 rounded-xl p-3.5 hover:border-indigo-300 dark:hover:border-indigo-500 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{doc.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                        {doc.category}
                      </span>
                      {doc.confirmationCode && (
                        <span className="text-xs font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          Ref: {doc.confirmationCode}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {doc.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-white dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    {doc.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add New Document Form */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Add New Document</div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Document Title (e.g., Hotel Voucher)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <input
              type="text"
              placeholder="Booking / Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium cursor-pointer"
            >
              <option value="Hotel Voucher" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Hotel Voucher</option>
              <option value="Ticket" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Transit / Flight Ticket</option>
              <option value="Visa/Passport" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Visa / Passport Note</option>
              <option value="Insurance" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Travel Insurance</option>
              <option value="Note" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">General Note</option>
            </select>
            <input
              type="text"
              placeholder="Important Notes / Gates / Instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition"
            >
              Add Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
