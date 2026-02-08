import React, { useState, useEffect, useRef } from 'react';
import { User, X, ShieldCheck, Mail, ArrowRight, Send, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AFFILIATE_LINK, submitLeadToBackend } from '../utils/api';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [leadInfo, setLeadInfo] = useState<{ name: string, email: string } | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: "Hey! I'm Mark. Your local business reputation is either your best salesperson or your worst nightmare. Mind if I show you how to automate your 5-star proof in under 2 minutes?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', email: '' });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, leadInfo, isLoading]);

    const handleLeadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (leadForm.name && leadForm.email) {
            submitLeadToBackend(leadForm.email, leadForm.name, "Chatbot Lead");
            setLeadInfo(leadForm);
            setMessages(prev => [...prev, { role: 'bot', text: `Great to meet you, ${leadForm.name.split(' ')[0]}! Reputation is everything for a local biz. Are you currently struggling with getting new reviews, or are you worried about a few bad ones dragging you down?` }]);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading || !leadInfo) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setIsLoading(true);

        try {
            // Fix: Always use process.env.API_KEY directly for initialization as per guidelines
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                // Fix: Simplify contents to a single prompt string for basic text tasks
                contents: messages.map(m => `${m.role === 'bot' ? 'Assistant' : 'User'}: ${m.text}`).join('\n') + `\nUser: ${userMsg}`,
                config: {
                    systemInstruction: `You are 'Mark', a local business growth specialist. The user's name is ${leadInfo.name}. 
          
          HUMAN-LIKE RULES:
          1. Use the user's first name naturally.
          2. Focus on local business pain: competitors taking customers, Yelp/Google bad reviews, the 'ghost town' website effect.
          3. Emphasize that Trustindex handles the 'tech' so they can focus on their business.
          4. Always lead them toward starting their free trial at ${AFFILIATE_LINK}.
          5. Keep responses under 3-4 sentences. Talk like a local consultant.`,
                    temperature: 0.8,
                }
            });

            const botText = response.text || `Honestly, every day without a solid review system is a day you're losing local customers. Check the setup here: ${AFFILIATE_LINK}`;
            setMessages(prev => [...prev, { role: 'bot', text: botText }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: `Reputation is non-negotiable. Grab your free plan here to secure your local ranking: ${AFFILIATE_LINK}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 w-[350px] md:w-[420px] h-[650px] bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <div className="bg-[#198F65] p-6 text-white flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="flex items-center space-x-4 relative">
                            <div className="relative">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#198F65] shadow-lg">
                                    <User className="w-8 h-8" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-[#198F65] rounded-full animate-pulse shadow-sm"></div>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <p className="font-black text-lg uppercase tracking-widest">Mark</p>
                                    <span className="flex items-center text-[10px] font-black bg-green-400/20 text-green-300 px-2 py-1 rounded-full uppercase tracking-tighter">Online</span>
                                </div>
                                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Local Reputation Guide</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform relative z-10 p-2 bg-white/10 rounded-full">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 scroll-smooth">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[88%] p-5 rounded-2xl text-base font-semibold leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#198F65] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100/50'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {!leadInfo && (
                            <div className="p-8 bg-white border border-green-100 rounded-[2.5rem] shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                                <div className="text-center mb-8">
                                    <div className="w-14 h-14 bg-green-50 text-[#198F65] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <ShieldCheck className="w-7 h-7" />
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight">Protect Your Local Biz</h4>
                                    <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-wide">Chat with Mark about your reputation.</p>
                                </div>
                                <form onSubmit={handleLeadSubmit} className="space-y-5">
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#198F65] transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Your First Name"
                                            className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-base font-bold focus:bg-white focus:ring-4 focus:ring-green-100/50 focus:border-[#198F65] outline-none transition-all shadow-inner"
                                            value={leadForm.name}
                                            onChange={e => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#198F65] transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="Business Email"
                                            className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-base font-bold focus:bg-white focus:ring-4 focus:ring-green-100/50 focus:border-[#198F65] outline-none transition-all shadow-inner"
                                            value={leadForm.email}
                                            onChange={e => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-[#198F65] text-white font-black py-6 rounded-2xl hover:bg-[#147250] transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center shadow-2xl shadow-[#198F65]/30 group">
                                        Start Chat <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Mark is typing...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {leadInfo && (
                        <div className="p-6 bg-white border-t border-gray-100 flex items-center space-x-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="How can I help your business?"
                                className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-5 text-base font-semibold focus:ring-4 focus:ring-green-100/50 outline-none transition-all"
                            />
                            <button onClick={handleSend} className="bg-[#198F65] text-white p-5 rounded-2xl hover:bg-[#147250] transition-all shadow-xl hover:scale-105 active:scale-95 group">
                                <Send className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-[#198F65] text-white p-5 md:p-6 rounded-[2.2rem] shadow-[0_20px_50px_-10px_rgba(25,143,101,0.6)] hover:scale-110 active:scale-95 transition-all duration-500 relative group flex items-center space-x-4 ${isOpen ? 'rotate-0' : ''}`}
            >
                <div className="relative">
                    {isOpen ? <X className="w-8 h-8 md:w-9 md:h-9" /> : <MessageSquare className="w-8 h-8 md:w-9 md:h-9" />}
                    {!isOpen && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-[#198F65] rounded-full animate-pulse"></div>}
                </div>
                {!isOpen && (
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-black uppercase text-sm tracking-widest px-0 group-hover:px-2">
                        Reputation Specialist
                    </span>
                )}
            </button>
        </div>
    );
};

export default AIChatbot;
