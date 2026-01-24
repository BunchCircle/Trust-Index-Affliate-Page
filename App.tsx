import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertTriangle, Zap, ShieldCheck, ArrowRight, Award, ChevronDown, Star, X, Mail, Phone, MessageSquare, TrendingUp, XCircle, MousePointer2, Settings2, Rocket, Clock, Database, Globe, Download, Eye, FileText, Send, User, Bot, Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Constants ---
const AFFILIATE_LINK = "https://www.trustindex.io/?ref=YOUR_AFFILIATE_ID";
const VIDEO_PLACEHOLDER_URL = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1280&auto-format&fit=crop";
const PROFILE_PIC_URL = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=256&auto-format&fit=crop";

const LOGO_MARQUEE = ["Google", "Facebook", "Yelp", "Amazon", "G2", "Tripadvisor", "Trustpilot", "App Store", "Booking.com", "Capterra"];

// --- Backend Integration Helper ---
const submitLeadToBackend = async (email: string) => {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSIdLPXef1_-W-rOWjeoV_Akva5HLnxX4a85X8LteKYs3VMeH5f-PuXy9t19rirX4i/exec";
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Required for Google Apps Script Web Apps
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    });
  } catch (error) {
    console.error("Lead submission failed:", error);
  }
};

// --- Sub-components ---
const Section = ({ children, className = "", id = "" }: React.PropsWithChildren<{ className?: string, id?: string }>) => (
  <section id={id} className={`py-16 px-4 md:py-24 ${className}`}>
    <div className="max-w-6xl mx-auto">
      {children}
    </div>
  </section>
);

const PrimaryButton = ({ onClick, children, pulse = false, className = "" }: React.PropsWithChildren<{ onClick?: () => void, pulse?: boolean, className?: string }>) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center bg-[#198F65] hover:bg-[#147250] text-white font-extrabold text-lg md:text-xl py-4 px-8 md:py-5 md:px-10 rounded-full transition-all duration-300 transform ${pulse ? 'animate-pulse-custom' : 'hover:scale-105'} shadow-xl uppercase tracking-wider text-center ${className}`}
  >
    {children}
    <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
  </button>
);

const TrustNotification = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: "Robert M.", location: "Texas" });

  useEffect(() => {
    const names = ["Robert M.", "Sarah K.", "James W.", "Elena R.", "David L."];
    const locs = ["Texas", "London", "Sydney", "Berlin", "New York"];
    
    const show = () => {
      setData({ 
        name: names[Math.floor(Math.random() * names.length)], 
        location: locs[Math.floor(Math.random() * locs.length)] 
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    const interval = setInterval(show, 15000);
    setTimeout(show, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed bottom-4 left-4 z-[60] bg-white border border-gray-100 rounded-lg shadow-2xl p-4 flex items-center space-x-3 transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <div className="bg-green-100 p-2 rounded-full">
        <TrendingUp className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{data.name} from {data.location}</p>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-tight">Activated Trustindex 4m ago</p>
      </div>
    </div>
  );
};

// --- AIChatbot Component ---
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
      submitLeadToBackend(leadForm.email);
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
        model: 'gemini-3-flash-preview',
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

// --- Redirect Gate Modal ---
const RedirectLeadModal: React.FC<{isOpen: boolean, onClose: () => void, onSuccess: () => void}> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-950/98 backdrop-blur-2xl flex items-center justify-center z-[110] p-4 animate-in fade-in duration-500" onClick={onClose}>
      <div className="relative bg-white rounded-[4rem] shadow-2xl p-12 md:p-16 max-w-2xl w-full transform transition-all animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 ease-out" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-gray-900 transition-all">
          <X className="w-10 h-10" />
        </button>
        <div className="text-center">
            <div className="bg-green-50 text-[#198F65] w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
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
                        className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-transparent rounded-[2.2rem] focus:bg-white focus:border-[#198F65] outline-none font-bold text-gray-900 placeholder:text-gray-300 transition-all text-lg shadow-inner" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-[#198F65] text-white font-black py-6 rounded-[2.2rem] hover:bg-[#147250] shadow-xl transition-all uppercase tracking-[0.2em] text-base flex items-center justify-center group">
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

const App: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const exitIntentTriggered = useRef(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (!exitIntentTriggered.current && e.clientY <= 10) {
        exitIntentTriggered.current = true;
        setIsModalOpen(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
    
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const handleConversionClick = () => {
    if (isLeadCaptured) {
      window.location.href = AFFILIATE_LINK;
    } else {
      setIsRedirectModalOpen(true);
    }
  };

  const onRedirectSuccess = () => {
    setIsLeadCaptured(true);
    setIsRedirectModalOpen(false);
    window.location.href = AFFILIATE_LINK;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-green-100 selection:text-green-900 bg-[#FBF9F6]">
      
      {/* --- Sticky Header --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all duration-300 transform ${scrolled ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-[#198F65] rounded flex items-center justify-center text-white font-black text-lg">T</div>
            <span className="font-extrabold text-2xl tracking-tighter">Trustindex<span className="text-[#198F65]">.io</span></span>
          </div>
          <div className="flex items-center space-x-4 md:space-x-8">
             <button onClick={() => setIsModalOpen(true)} className="hidden md:flex items-center text-sm font-black text-gray-500 hover:text-[#198F65] transition-colors uppercase tracking-widest px-4 py-2">
                <FileText className="w-5 h-5 mr-3" />
                Reputation Guide
             </button>
             <button onClick={handleConversionClick} className="bg-[#198F65] text-white px-6 py-3 md:px-8 md:py-3 rounded-full text-sm md:text-base font-black hover:bg-[#147250] transition-all hover:scale-105 shadow-lg shadow-[#198F65]/20">
                Fix My Reputation
             </button>
          </div>
        </div>
      </nav>

      {/* --- Top Utility Bar --- */}
      <div className="bg-gray-900 text-white py-3 px-4 w-full flex items-center justify-center space-x-4 relative z-[70]">
        <p className="text-xs md:text-sm font-black uppercase tracking-[0.15em] text-center text-gray-300">
            Critical: <span className="text-[#198F65]">92% of local customers</span> read reviews before making a choice.
        </p>
      </div>

      {/* --- Hero Section --- */}
      <Section className="text-center !pt-12 md:!pt-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-green-50/50 -z-10 blur-[120px] rounded-full"></div>
        
        <div className="inline-flex items-center space-x-3 mb-12 bg-green-50/50 text-[#147250] px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest border border-green-100 backdrop-blur-sm shadow-sm">
          <Zap className="w-5 h-5 fill-current animate-pulse mr-2" />
          <span>The Definitive Local Business Reputation Shield</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-gray-900 leading-[0.95] mb-12 tracking-tighter">
          One Bad Review Can <br/>
          <span className="text-red-600 relative inline-block">Cost You Customers,<div className="absolute -bottom-3 left-0 w-full h-5 bg-red-100 -z-10 -rotate-1 opacity-70"></div></span><br/>
          <span className="text-[#198F65]">Protect Your Business.</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-gray-500 max-w-4xl mx-auto mb-16 leading-relaxed font-semibold">
          If you don’t have consistent 5-star proof, customers move on. Automatically collect reviews, manage negative feedback, and <span className="text-gray-900 font-bold italic underline">secure your local reputation</span> with Trustindex.
        </p>
        
        <div className="flex flex-col items-center space-y-8 mb-24">
            <PrimaryButton onClick={handleConversionClick} pulse>
                Build My 5-Star Reputation
            </PrimaryButton>
            <div className="flex flex-wrap justify-center gap-10 text-sm font-black text-gray-400 uppercase tracking-widest">
                <span className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-green-500" /> Automated Requests</span>
                <span className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-green-500" /> Multi-Platform Sync</span>
                <span className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-green-500" /> Negative Review Shield</span>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center text-base font-bold text-gray-500 hover:text-[#198F65] transition-all underline underline-offset-8 decoration-gray-200 hover:decoration-[#198F65]"
            >
                <Download className="w-5 h-5 mr-3 group-hover:-translate-y-1 transition-transform" />
                Not ready? Get the "7 Trust Killers" PDF for local biz.
            </button>
        </div>

        {/* --- Feature Visualization --- */}
        <div className="relative w-full max-w-6xl mx-auto group">
          <div className="absolute -inset-10 bg-[#198F65]/5 blur-[100px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-white rounded-[3rem] md:rounded-[5rem] shadow-2xl overflow-hidden border-[16px] border-white ring-1 ring-gray-100 transform group-hover:-translate-y-2 transition-transform duration-700">
            <img src={VIDEO_PLACEHOLDER_URL} alt="Reputation Dashboard" className="w-full opacity-95 group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute bottom-8 left-8 right-8 md:bottom-20 md:left-20 bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 text-left max-w-lg hidden md:block animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                    </div>
                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Local PR System</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">The "Google Maps" Dominator</h3>
                <p className="text-base text-gray-500 font-semibold leading-relaxed">Systematically collects reviews on Google, Yelp, and Facebook to push your local ranking to the top.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* --- Marquee --- */}
      <div className="bg-white/30 backdrop-blur-sm py-16 border-y border-gray-100 overflow-hidden whitespace-nowrap relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FBF9F6] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FBF9F6] to-transparent z-10"></div>
        <div className="animate-marquee inline-block">
          {[...LOGO_MARQUEE, ...LOGO_MARQUEE].map((logo, i) => (
            <span key={i} className="text-2xl md:text-4xl font-black text-gray-300 mx-16 md:mx-24 uppercase tracking-tighter hover:text-[#198F65] transition-colors cursor-default select-none">
              {logo}
            </span>
          ))}
        </div>
      </div>

      {/* --- THE REALITY CHECK --- */}
      <Section className="bg-transparent">
        <div className="text-center mb-24">
            <span className="text-[#198F65] font-black text-sm uppercase tracking-[0.4em] mb-6 block">The Invisibility Trap</span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight">Your Local Business <br/>"Blind Spot"</h2>
            <p className="text-2xl text-gray-500 mt-8 font-semibold italic">If your competitor has 15 more 5-star reviews than you, you are losing money every hour.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 relative overflow-hidden group hover:bg-red-50/30 transition-colors">
            <div className="absolute top-0 right-0 bg-red-500 text-white px-10 py-4 rounded-bl-[2.5rem] font-black text-xs uppercase tracking-widest">Static Reputation</div>
            <div className="space-y-10 opacity-40 grayscale group-hover:opacity-60 transition-opacity">
              <div className="h-8 w-3/4 bg-gray-200 rounded-full"></div>
              <div className="h-56 w-full bg-gray-100 rounded-[3rem] flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <XCircle className="w-20 h-20 text-red-300 mb-5" />
                <p className="text-red-400 font-black text-lg">"Last review: 8 months ago"</p>
              </div>
              <div className="h-8 w-full bg-gray-200 rounded-full"></div>
            </div>
            <p className="mt-14 text-red-600 font-black flex items-center text-2xl tracking-tight">
              <AlertTriangle className="w-9 h-9 mr-5" /> Visitors Assume You're Closed
            </p>
            <p className="text-red-400 text-base mt-4 font-bold">Stale reviews are a massive red flag for local customers.</p>
          </div>

          <div className="bg-[#198F65] rounded-[3.5rem] p-12 shadow-[0_40px_100px_-20px_rgba(25,143,101,0.3)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute top-0 right-0 bg-white text-[#198F65] px-10 py-4 rounded-bl-[2.5rem] font-black text-xs uppercase tracking-widest shadow-xl">Trustindex Active</div>
            <div className="space-y-10">
              <div className="h-8 w-3/4 bg-green-400/30 rounded-full"></div>
              <div className="h-56 w-full bg-white/10 backdrop-blur-md rounded-[3rem] flex flex-col items-center justify-center p-10 border border-white/20 shadow-inner">
                <div className="flex space-x-2 mb-6 scale-125">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-10 h-10 text-yellow-400 fill-current drop-shadow-[0_4px_10px_rgba(250,204,21,0.4)]" />)}
                </div>
                <div className="text-white font-black text-3xl tracking-tighter">"Best Service in the Area!"</div>
                <div className="text-green-200 text-sm font-black mt-4 uppercase tracking-[0.2em] opacity-80 animate-pulse">Review Posted 4h ago</div>
              </div>
            </div>
            <p className="mt-14 text-white font-black flex items-center text-2xl tracking-tight">
              <CheckCircle className="w-9 h-9 mr-5 text-green-400" /> Dominate Local Search
            </p>
            <p className="text-green-100 text-base mt-4 font-bold opacity-90">Fresh, consistent social proof that commands respect.</p>
          </div>
        </div>
      </Section>

      {/* --- LOCAL BIZ PROBLEMS SOLVED --- */}
      <Section className="bg-[#FBF9F6]">
        <div className="max-w-4xl mx-auto text-center mb-24">
            <span className="text-[#198F65] font-black text-sm uppercase tracking-[0.4em] mb-6 block">The Solution Suite</span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight">Your Reputation "Engine"</h2>
            <p className="text-2xl text-gray-500 mt-8 font-semibold">We help local businesses solve the 4 biggest reputation bottlenecks.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {[
                { type: "The 'Review Void'", desc: "Most customers forget to leave feedback. Our automated system follows up via SMS/Email at the perfect moment to capture the 5-star experience.", icon: <Settings2 /> },
                { type: "Negative Review Shield", desc: "Get notified the second a bad review hits. Respond instantly with pre-built professional templates to turn a disaster into a PR win.", icon: <ShieldCheck /> },
                { type: "Fake Review Handling", desc: "Spammed by a competitor? We provide a step-by-step framework and toolset to report and remove fraudulent reviews that violate platform policies.", icon: <AlertTriangle /> },
                { type: "Authority Broadcasting", desc: "Don't hide your wins. Automatically display your best reviews in high-converting widgets on your website, email signatures, and social media.", icon: <Award /> }
            ].map((item, i) => (
                <div key={i} className="p-12 bg-white border border-gray-100 rounded-[3rem] flex items-start space-x-8 hover:shadow-2xl hover:border-green-100 transition-all group">
                    <div className="p-5 bg-green-50 text-[#198F65] rounded-[1.8rem] group-hover:bg-[#198F65] group-hover:text-white transition-colors">
                        {/* Fix: Explicitly cast to React.ReactElement<any> to resolve TypeScript overload matching error for className property */}
                        {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-10 h-10" })}
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 mb-3 text-2xl tracking-tight">{item.type}</h4>
                        <p className="text-lg text-gray-500 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </Section>

      {/* --- NEW SECTION: Why Every Business Must Use It --- */}
      <Section className="bg-white rounded-[4rem] md:rounded-[6rem] border border-gray-100 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-16 opacity-[0.04] pointer-events-none">
          <RefreshCcw className="w-80 h-80 text-[#198F65] animate-spin-slow" />
        </div>
        <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
                <span className="text-[#198F65] font-black text-sm uppercase tracking-[0.4em] mb-6 block">The Set-and-Forget Standard</span>
                <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight mb-10">Why Every Business Must Use It</h2>
                <p className="text-2xl text-gray-500 mb-12 leading-relaxed font-semibold">
                    Reputation management used to be a full-time job. With Trustindex, it's a <strong>2-minute initial setup</strong>. After that, the software works automatically with <span className="text-gray-900 font-black">minimal to no human intervention.</span>
                </p>
                
                {/* Vertical Checkbox Style List */}
                <div className="space-y-8">
                    {[
                        { title: "Automatic Review Harvesting", desc: "Systematically collects fresh customer reviews without any manual effort or follow-ups from your team." },
                        { title: "24/7 Negative Feedback Sentry", desc: "Monitors and helps you professionally respond to negative reviews instantly, protecting your local brand image." },
                        { title: "AI-Powered Spam Defense", desc: "Identifies and helps remove spam, fake, or policy-violating reviews that unfairly damage your rating." },
                        { title: "Omni-Channel Syncing", desc: "Showcases positive reviews automatically across your website, social channels, and connected profiles." }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start space-x-6 group">
                            <div className="flex-shrink-0 mt-1.5">
                                <div className="bg-green-50 text-[#198F65] p-2 rounded-xl group-hover:bg-[#198F65] group-hover:text-white transition-colors duration-300">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="border-b border-gray-50 pb-6 w-full">
                                <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-[#198F65] transition-colors">{item.title}</h4>
                                <p className="text-lg text-gray-500 font-semibold leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-10">
                    <PrimaryButton onClick={handleConversionClick} pulse>
                        Automate My Growth
                    </PrimaryButton>
                    <div className="flex items-center text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
                        <Sparkles className="w-6 h-6 mr-3 text-[#198F65]" /> 100% Autopilot Software
                    </div>
                </div>
            </div>

            <div className="relative group lg:block hidden">
                <div className="absolute -inset-6 bg-green-50 rounded-[4rem] -z-10 transform rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
                <div className="bg-gray-50 rounded-[4rem] p-16 border border-gray-100 shadow-inner flex flex-col items-center justify-center text-center space-y-10">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg relative">
                        <Clock className="w-14 h-14 text-[#198F65]" />
                        <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-tighter animate-bounce">Live</div>
                    </div>
                    <div>
                        <p className="text-5xl font-black text-gray-900 tracking-tighter">0 Hours</p>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mt-3">Manual Work Per Month</p>
                    </div>
                    <div className="w-full h-px bg-gray-200"></div>
                    <div className="flex space-x-3 scale-110">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />)}
                    </div>
                    <p className="text-lg text-gray-500 font-bold italic leading-relaxed px-6">
                        "I set it up on a Tuesday morning. By Friday, I had 4 new Google reviews and my website trust score jumped. I haven't logged in since."
                    </p>
                </div>
            </div>
        </div>
      </Section>

      {/* --- THE REPUTATION CYCLE --- */}
      <Section className="bg-transparent">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight">The 3-Step Trust Loop</h2>
          <p className="text-2xl text-gray-500 mt-8 font-semibold italic">How Trustindex scales your authority on autopilot.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-20 relative">
            <div className="hidden md:block absolute top-20 left-0 w-full h-1 bg-green-50 -z-10"></div>
            {[
                { step: "01", icon: <Database className="w-14 h-14" />, title: "Connect Platforms", desc: "Sync Google, Yelp, FB, and 130+ others. We aggregate your reputation into one single command center." },
                { step: "02", icon: <MessageSquare className="w-14 h-14" />, title: "Automate Outreach", desc: "Our system asks every happy customer for a review, dramatically increasing your 5-star volume." },
                { step: "03", icon: <TrendingUp className="w-14 h-14" />, title: "Convert & Rank", desc: "Showcase proof to web visitors. Higher review counts boost your SEO and local map ranking." }
            ].map((s, i) => (
                <div key={i} className="text-center group">
                    <div className="w-36 h-36 bg-[#198F65] rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl transform group-hover:-translate-y-4 transition-transform relative">
                        {s.icon}
                        <span className="absolute -top-5 -right-5 bg-white text-[#198F65] text-sm font-black w-12 h-12 rounded-full border-[3px] border-[#198F65] flex items-center justify-center shadow-xl">{s.step}</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-5 tracking-tight">{s.title}</h3>
                    <p className="text-lg text-gray-500 font-semibold leading-relaxed px-6">{s.desc}</p>
                </div>
            ))}
        </div>
      </Section>

      {/* --- PAIN POINT HIGHLIGHT --- */}
      <Section className="bg-gray-950 text-white rounded-[5rem] md:rounded-[8rem] overflow-hidden relative">
        <div className="absolute inset-0 bg-[#198F65]/5 -z-10 animate-pulse"></div>
        <div className="grid md:grid-cols-2 gap-24 items-center">
            <div>
                <span className="text-green-400 font-black text-sm uppercase tracking-[0.5em] mb-8 block">The Silent Business Killer</span>
                <h2 className="text-5xl md:text-7xl font-black mb-12 leading-[0.95] tracking-tighter">Your Poor Rating is <br/>a Competitor's Asset.</h2>
                <div className="space-y-10">
                    {[
                        "One bad review can drop your leads by 40% overnight.",
                        "If you aren't responding to reviews, you look like you don't care.",
                        "Relying on 'word of mouth' is dangerous in a digital-first local economy."
                    ].map((text, i) => (
                        <div key={i} className="flex items-start space-x-6">
                            <div className="bg-red-500/10 p-2.5 rounded-xl mt-1">
                                <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                            </div>
                            <p className="text-2xl text-gray-300 font-semibold italic leading-relaxed">"{text}"</p>
                        </div>
                    ))}
                </div>
                <div className="mt-16 p-12 bg-white/5 border-l-[14px] border-[#198F65] rounded-r-[3rem] backdrop-blur-sm">
                    <p className="text-green-400 font-black uppercase text-sm tracking-widest mb-4">The Brutal Reality</p>
                    <p className="text-2xl text-gray-200 font-bold leading-relaxed tracking-tight">Your customers are talking about you. If you aren't part of that conversation, you're handing over your local market share.</p>
                </div>
            </div>
            <div className="bg-white rounded-[4rem] p-16 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="mb-12">
                    <div className="w-24 h-24 bg-green-50 text-[#198F65] rounded-[2rem] flex items-center justify-center mx-auto mb-10">
                        <Rocket className="w-12 h-12" />
                    </div>
                    <h3 className="text-5xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">Start Dominating.</h3>
                    <p className="text-gray-500 mb-14 text-2xl leading-relaxed font-semibold">Turn your reputation into a local lead-gen machine today.</p>
                </div>
                <PrimaryButton onClick={handleConversionClick} pulse className="w-full">
                    Start My Free Trial
                </PrimaryButton>
                <p className="mt-10 text-gray-400 font-black uppercase text-xs tracking-widest flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 mr-3 text-green-500" /> No Tech Skills or Credit Card Required
                </p>
            </div>
        </div>
      </Section>

      {/* --- CONSULTANT PROOF --- */}
      <Section className="bg-transparent">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <div className="relative">
             <div className="absolute -top-16 -left-16 w-80 h-80 bg-[#198F65]/10 rounded-full blur-[120px]"></div>
             <img src={PROFILE_PIC_URL} alt="Mark Thompson" className="relative w-full rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] rotate-2 hover:rotate-0 transition-transform duration-700 ease-out" />
             <div className="absolute -bottom-12 -right-12 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 max-w-sm hidden lg:block">
                <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />)}
                </div>
                <p className="font-bold text-gray-900 text-lg leading-relaxed">"The only tool I recommend for local business survival."</p>
             </div>
          </div>
          <div>
            <div className="flex items-center space-x-4 text-[#198F65] mb-10">
              <div className="p-4 bg-green-50 rounded-2xl">
                <Award className="w-10 h-10" />
              </div>
              <span className="font-black uppercase tracking-[0.4em] text-base">Official Reputation Partner</span>
            </div>
            <h3 className="text-5xl md:text-6xl font-black text-gray-900 mb-10 leading-tight tracking-tighter">"Online reputation is <br/>the new digital currency."</h3>
            <p className="text-2xl md:text-3xl text-gray-500 italic mb-12 leading-relaxed font-semibold">
              "Local business owners spend thousands on ads, but ignore their reviews. That's like pouring water into a leaky bucket. Trustindex seals that bucket. It builds instant rapport before you even pick up the phone. It's the highest ROI tool in your stack."
            </p>
            <div className="flex items-center space-x-6">
                <div className="w-16 h-1 bg-[#198F65]"></div>
                <p className="font-black text-gray-900 text-2xl tracking-tight">Mark Thompson, Reputation Strategy Expert</p>
            </div>
          </div>
        </div>
      </Section>

      {/* --- FAQ SECTION --- */}
      <Section id="faq" className="bg-transparent">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-24">
                <span className="text-[#198F65] font-black text-sm uppercase tracking-[0.5em] mb-6 block">Protect Your Investment</span>
                <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight">Local Biz Questions</h2>
            </div>
            <div className="space-y-8">
                {[
                    { q: "How do I deal with fake reviews from competitors?", a: "Trustindex includes a dedicated toolkit for identifying and reporting fake reviews. We guide you through the exact process to flag content that violates platform terms, increasing your success rate in getting them removed." },
                    { q: "Will this help my Google Maps ranking?", a: "Yes. Review frequency, quantity, and star rating are core factors in Google's local algorithm. By automating review collection, you increase your 'activity' score, which helps push you higher in the local 3-pack." },
                    { q: "Can I manage everything from my phone?", a: "Absolutely. Our dashboard is fully responsive. You can respond to negative reviews instantly while on the job, showing customers you're proactive and professional." },
                    { q: "Do I need to give my login details to Trustindex?", a: "No. We use secure API connections and public feed aggregators. You maintain full control over your accounts while we pull and push data to keep your website widgets fresh." }
                ].map((item, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-green-100 transition-all">
                        <button onClick={() => toggleFaq(i)} className="w-full p-10 md:p-12 flex items-center justify-between text-left group">
                            <span className="text-2xl font-black text-gray-900 group-hover:text-[#198F65] transition-colors tracking-tight leading-tight">{item.q}</span>
                            <div className={`p-3 rounded-full transition-colors ${openFaq === i ? 'bg-[#198F65] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-green-50 group-hover:text-[#198F65]'}`}>
                                <ChevronDown className={`w-8 h-8 transition-transform duration-500 ${openFaq === i ? 'rotate-180' : ''}`} />
                            </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-[600px] opacity-100 pb-12 px-10 md:px-12' : 'max-h-0 opacity-0'}`}>
                            <div className="w-full h-px bg-gray-100 mb-10"></div>
                            <p className="text-gray-500 font-semibold text-xl leading-relaxed">{item.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </Section>

      {/* --- FINAL CTA --- */}
      <Section className="bg-[#198F65] text-white rounded-t-[6rem] md:rounded-t-[14rem] text-center overflow-hidden relative pb-40">
        <div className="absolute inset-0 bg-gray-900/10 -z-10"></div>
        <div className="max-w-5xl mx-auto relative px-6">
            <h2 className="text-6xl md:text-9xl font-black mb-12 leading-[0.9] tracking-tighter">Become the <br/>Local <span className="text-gray-900 italic">Leader.</span></h2>
            <p className="text-2xl md:text-4xl text-green-100 mb-20 max-w-3xl mx-auto font-semibold leading-relaxed tracking-tight">
                Stop losing local customers to competitors with better reviews. Secure your reputation today.
            </p>
            <div className="flex flex-col items-center">
                <PrimaryButton onClick={handleConversionClick} pulse className="mb-12 bg-white !text-[#198F65] hover:!bg-gray-50 !shadow-2xl">
                    Claim My 5-Star Boost
                </PrimaryButton>
                <div className="flex flex-wrap justify-center gap-12 text-sm font-black uppercase tracking-[0.4em] text-green-200">
                    <span className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-white" /> Rank Higher</span>
                    <span className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-white" /> Convert More</span>
                    <span className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-white" /> 100% Automated</span>
                </div>
            </div>
        </div>
      </Section>

      {/* --- Footer --- */}
      <footer className="bg-gray-950 py-40 px-6 text-center">
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-16 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                <span className="font-extrabold text-4xl tracking-tighter text-white">Trustindex<span className="text-[#198F65]">.io</span></span>
            </div>
            <p className="text-gray-500 text-base max-w-3xl mx-auto mb-20 leading-relaxed font-semibold">
                <span className="font-black text-gray-400 uppercase tracking-widest text-sm block mb-6">Disclosure:</span> 
                This landing page is designed to showcase the benefits of Trustindex. We are an independent partner and may earn a commission if you sign up using our link. We only endorse tools that provide measurable business growth for our clients.
            </p>
            <div className="flex justify-center flex-wrap gap-12 text-xs font-black uppercase tracking-[0.5em] text-gray-600 mb-20">
                <a href="#" className="hover:text-[#198F65] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#198F65] transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-[#198F65] transition-colors">Contact Support</a>
            </div>
            <p className="text-gray-800 text-xs font-bold tracking-[0.6em] uppercase">&copy; {new Date().getFullYear()} REPUTATION ACCELERATOR. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      <TrustNotification />
      <AIChatbot />
      
      {/* --- Floating Bottom CTA --- */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 transform ${scrolled ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <PrimaryButton onClick={handleConversionClick} pulse className="whitespace-nowrap shadow-2xl scale-95 md:scale-110 px-12">
          Fix My Reputation Now
        </PrimaryButton>
      </div>

      <LeadMagnetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConversion={() => {
          setIsLeadCaptured(true);
          window.location.href = AFFILIATE_LINK;
        }}
      />
      <RedirectLeadModal 
        isOpen={isRedirectModalOpen} 
        onClose={() => setIsRedirectModalOpen(false)} 
        onSuccess={onRedirectSuccess} 
      />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes pulse-custom {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(25, 143, 101, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 50px 15px rgba(25, 143, 101, 0); }
        }
        .animate-pulse-custom {
          animation: pulse-custom 3s infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

// --- Lead Magnet Modal ---
const LeadMagnetModal: React.FC<{isOpen: boolean, onClose: () => void, onConversion: () => void}> = ({ isOpen, onClose, onConversion }) => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-950/98 backdrop-blur-2xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-500" onClick={onClose}>
      <div className="relative bg-white rounded-[5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.8)] p-12 md:p-24 max-w-3xl w-full transform transition-all animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 ease-out" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-12 right-12 text-gray-300 hover:text-gray-900 transition-all hover:rotate-90">
          <X className="w-12 h-12" />
        </button>
        
        {!submitted ? (
          <div className="text-center">
            <div className="bg-green-50 text-[#198F65] w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-inner">
              <Download className="w-14 h-14" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter leading-[1.1]">Wait! Your Local Biz is Leaking Cash.</h2>
            <p className="text-2xl text-gray-500 mb-14 leading-relaxed font-semibold px-6">
                Grab the <span className="text-[#198F65] font-black">"Reputation Shield"</span>: 7 Spots on your site to place reviews for a <span className="text-gray-900 font-black underline">2X Sales Lift</span>.
            </p>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); submitLeadToBackend(email); setSubmitted(true); }}>
              <div className="relative group">
                <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-300 group-focus-within:text-[#198F65] transition-colors" />
                <input 
                    type="email" 
                    placeholder="Where should we send the PDF?" 
                    className="w-full pl-20 pr-10 py-7 bg-gray-50 border-2 border-transparent rounded-[2.5rem] focus:bg-white focus:border-[#198F65] outline-none font-bold text-gray-900 placeholder:text-gray-300 transition-all text-xl shadow-inner" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <button type="submit" className="w-full bg-[#198F65] text-white font-black py-8 rounded-[2.5rem] hover:bg-[#147250] shadow-[0_20px_40px_-10px_rgba(25, 143, 101, 0.4)] transition-all uppercase tracking-[0.2em] text-2xl flex items-center justify-center group">
                Send My Guide
                <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
            <div className="mt-14 flex items-center justify-center space-x-10">
                <div className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest">
                    <ShieldCheck className="w-6 h-6 mr-3 text-green-500" /> Local Biz Safe
                </div>
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest">
                    <Clock className="w-6 h-6 mr-3 text-green-500" /> Delivered Instantly
                </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 animate-in zoom-in-95 duration-500">
            <div className="bg-green-100 text-green-600 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-12">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase leading-tight">ALMOST DONE!</h2>
            <p className="text-2xl text-gray-500 font-bold mb-12 px-6">
                Your <span className="font-bold text-[#198F65]">Reputation Shield Guide</span> will be sent within 2 minutes.
            </p>
            <button 
                onClick={() => {
                    onConversion();
                }} 
                className="w-full bg-[#198F65] text-white font-black py-8 rounded-[2.5rem] hover:bg-[#147250] shadow-xl transition-all uppercase tracking-[0.2em] text-2xl flex items-center justify-center group"
            >
                INCREASE MY SALES NOW
                <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="mt-10 flex items-center justify-center text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                <ShieldCheck className="w-6 h-6 mr-3 text-green-500" /> ONE STEP AWAY FROM LOCAL DOMINANCE.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;