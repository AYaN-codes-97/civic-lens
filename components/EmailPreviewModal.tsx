import React from 'react';
import { XMarkIcon } from './Icons';

interface EmailPreviewModalProps {
    emailData: {
        to: string;
        subject: string;
        body: string;
    };
    onClose: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ emailData, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl relative transform transition-all animate-slide-up-fast">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Email Preview</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="text-sm font-medium text-gray-400">To:</label>
                        <p className="mt-1 text-white bg-gray-900 p-2 rounded-md text-sm">{emailData.to}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400">Subject:</label>
                        <p className="mt-1 text-white bg-gray-900 p-2 rounded-md text-sm">{emailData.subject}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400">Body:</label>
                        <textarea
                            readOnly
                            value={emailData.body}
                            rows={10}
                            className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none sm:text-sm whitespace-pre-wrap"
                        />
                    </div>
                </div>
                <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Close
                    </button>
                     <button onClick={() => alert('Email sent (simulated)!')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Send Email
                    </button>
                </div>
            </div>
        </div>
    );
};
