import React, { useState } from 'react';
import { X, Download, Mail, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { AFFILIATE_LINK, submitLeadToBackend } from '../utils/api';

const LeadMagnetModal: React.FC<{ isOpen: boolean, onClose: () => void, onConversion: () => void }> = ({ isOpen, onClose, onConversion }) => {
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-950/98 backdrop-blur-2xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-500" onClick={onClose}>
            <div className="relative bg-white rounded-3xl shadow-[0_100px_200px_-50px_rgba(0,0,0,0.8)] p-8 max-w-lg w-full transform transition-all animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 ease-out" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-300 hover:text-gray-900 transition-all hover:rotate-90">
                    <X className="w-8 h-8" />
                </button>

                {!submitted ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-[#198F65] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Download className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tighter leading-[1.1]">Wait! Your Local Biz is Leaking Cash.</h2>
                        <p className="text-lg text-gray-500 mb-8 leading-relaxed font-semibold px-2">
                            Grab the <span className="text-[#198F65] font-black">"Reputation Shield"</span>: 7 Spots on your site to place reviews for a <span className="text-gray-900 font-black underline">2X Sales Lift</span>.
                        </p>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submitLeadToBackend(email); setSubmitted(true); }}>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-[#198F65] transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Where should we send the PDF?"
                                    className="w-full pl-16 pr-8 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#198F65] outline-none font-bold text-gray-900 placeholder:text-gray-300 transition-all text-base shadow-inner"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-[#198F65] text-white font-black py-4 rounded-2xl hover:bg-[#147250] shadow-[0_20px_40px_-10px_rgba(25, 143, 101, 0.4)] transition-all uppercase tracking-[0.2em] text-lg flex items-center justify-center group">
                                Send My Guide
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </form>
                        <div className="mt-8 flex items-center justify-center space-x-6">
                            <div className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> Local Biz Safe
                            </div>
                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                            <div className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest">
                                <Clock className="w-4 h-4 mr-2 text-green-500" /> Delivered Instantly
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                        <div className="bg-green-100 text-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase leading-tight">ALMOST DONE!</h2>
                        <p className="text-lg text-gray-500 font-bold mb-8 px-4">
                            Your <span className="font-bold text-[#198F65]">Reputation Shield Guide</span> will be sent within 2 minutes.
                        </p>
                        <button
                            onClick={() => {
                                onConversion();
                            }}
                            className="w-full bg-[#198F65] text-white font-black py-5 rounded-2xl hover:bg-[#147250] shadow-xl transition-all uppercase tracking-[0.2em] text-xl flex items-center justify-center group"
                        >
                            INCREASE MY SALES NOW
                            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                        <div className="mt-8 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            <ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> ONE STEP AWAY FROM LOCAL DOMINANCE.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadMagnetModal;
