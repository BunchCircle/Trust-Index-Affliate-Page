import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

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

export default TrustNotification;
