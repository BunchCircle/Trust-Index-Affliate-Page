import React, { useState } from 'react';
import { X, ShieldCheck, Mail, ArrowRight, Clock } from 'lucide-react';
import { submitLeadToBackend } from '../utils/api';

const RedirectLeadModal: React.FC<{ isOpen: boolean, onClose: () => void, onSuccess: () => void }> = ({ isOpen, onClose, onSuccess }) => {
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-950/98 backdrop-blur-2xl flex items-center justify-center z-[110] p-4 animate-in fade-in duration-500" onClick={onClose}>
            <div className="relative bg-white rounded-[3rem] shadow-2xl p-12 md:p-16 max-w-2xl w-full transform transition-all animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 ease-out" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-gray-900 transition-all">
                    <X className="w-10 h-10" />
                </button>
                <div className="text-center">
                    <div className="bg-green-50 text-[#198F65] w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-inner">
                        <ShieldCheck className="w-12 h-12" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter">Secure Your Reputation</h2>
                    <p className="text-xl text-gray-500 mb-12 leading-relaxed font-semibold">
                        Enter your business email to unlock your local conversion boost and head over to Trustindex.
                    </p>
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); submitLeadToBackend(email); onSuccess(); }}>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-[#198F65] transition-colors" />
                            <input
                                type="email"
                                placeholder="Business Email"
                                className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#198F65] outline-none font-bold text-gray-900 placeholder:text-gray-300 transition-all text-lg shadow-inner"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-[#198F65] text-white font-black py-6 rounded-2xl hover:bg-[#147250] shadow-xl transition-all uppercase tracking-[0.2em] text-base flex items-center justify-center group">
                            Unlock Reputation Tool <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                    <p className="mt-10 text-xs font-black text-gray-300 uppercase tracking-widest flex items-center justify-center">
                        <Clock className="w-5 h-5 mr-3" /> One more customer just checked your reviews.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RedirectLeadModal;
