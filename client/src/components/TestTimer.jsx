import { useEffect, useState } from 'react';

const TEST_DURATIONS = {
    vision: 5,
    refraction: 10,
    iop: 5,
    oct: 15,
    field: 20,
    preop: 25
};

export default function TestTimer({ test, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (test.status !== 'in_progress' || !test.start_time) return;

        const duration = TEST_DURATIONS[test.test_type] * 60; // Convert to seconds
        const startTime = new Date(test.start_time).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            const remaining = duration - elapsed;

            if (remaining <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
                if (onComplete) onComplete(test.id);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [test, onComplete]);

    if (test.status !== 'in_progress') return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const totalDuration = TEST_DURATIONS[test.test_type] * 60;
    const progress = Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100));

    // Color logic based on time remaining
    const isUrgent = timeLeft < 60; // Less than 1 minute
    const barColorClass = isUrgent ? 'from-red-500 to-orange-500' : 'from-blue-500 to-cyan-400';
    const textColorClass = isUrgent ? 'text-red-600' : 'text-blue-700';
    const bgPulseClass = isUrgent ? 'animate-pulse' : '';

    return (
        <div className={`mt-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden ${bgPulseClass}`}>
            <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isUrgent ? 'bg-red-400' : 'bg-blue-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Time Remaining</span>
                </div>
                <div className={`text-3xl font-mono font-bold ${textColorClass} tabular-nums tracking-tight`}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColorClass} transition-all duration-1000 ease-linear shadow-sm`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Background decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 blur-xl ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}></div>
        </div>
    );
}
