import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Section = ({ children, className = "", id = "" }: React.PropsWithChildren<{ className?: string, id?: string }>) => (
    <section id={id} className={`py-16 px-4 md:py-24 ${className}`}>
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
    </section>
);

export const PrimaryButton = ({ onClick, children, pulse = false, className = "" }: React.PropsWithChildren<{ onClick?: () => void, pulse?: boolean, className?: string }>) => (
    <button
        onClick={onClick}
        className={`inline-flex items-center justify-center bg-[#198F65] hover:bg-[#147250] text-white font-extrabold text-base md:text-lg py-3 px-6 md:py-4 md:px-9 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl uppercase tracking-wider text-center ${className}`}
    >
        {children}
        <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
    </button>
);
