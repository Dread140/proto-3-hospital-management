import { useEffect, useState } from 'react';
import { getWaitingTests, startTest, completeTest } from '../api/client';
import QueueCard from '../components/QueueCard';
import TestTimer from '../components/TestTimer';

export default function ScreeningPage() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTests = async () => {
        try {
            const data = await getWaitingTests();
            setTests(data);
            setError('');
        } catch (err) {
            setError('Failed to load tests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
        const interval = setInterval(fetchTests, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleStartTest = async (testId) => {
        try {
            await startTest(testId);
            await fetchTests();
        } catch (err) {
            alert('Failed to start test');
        }
    };

    const handleCompleteTest = async (testId) => {
        try {
            await completeTest(testId);
            await fetchTests();
        } catch (err) {
            alert('Failed to complete test');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500 mb-3">
                        Screening Tests
                    </h1>
                    <p className="text-lg text-gray-600 font-medium">Manage patient diagnostic queue and track test durations.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
                    Queue Length: <span className="text-blue-600 font-bold ml-1">{tests.length}</span>
                </div>
            </div>

            {error && (
                <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {tests.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
                    <div className="bg-teal-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">🎯</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Queue is Empty</h3>
                    <p className="text-gray-500 text-lg">Great job! All screening tests have been completed.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {tests.map((test) => (
                        <div key={test.id} className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
                            <QueueCard patient={test}>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-500 font-medium uppercase tracking-wide text-xs">Test Type</span>
                                        <span className="font-bold text-gray-800 uppercase bg-gray-100 px-2 py-1 rounded text-xs">{test.test_type}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm mb-4">
                                        <span className="text-gray-500 font-medium uppercase tracking-wide text-xs">Status</span>
                                        <span className={`font-bold px-2 py-1 rounded text-xs uppercase ${test.status === 'in_progress'
                                                ? 'bg-blue-100 text-blue-700 animate-pulse'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {test.status === 'in_progress' ? 'Running' : 'Waiting'}
                                        </span>
                                    </div>

                                    <TestTimer test={test} onComplete={handleCompleteTest} />

                                    <div className="flex gap-3 mt-6">
                                        {test.status === 'pending' && (
                                            <button
                                                onClick={() => handleStartTest(test.id)}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:from-blue-700 hover:to-indigo-700 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <span>▶️</span> Start Test
                                            </button>
                                        )}
                                        {test.status === 'in_progress' && (
                                            <button
                                                onClick={() => handleCompleteTest(test.id)}
                                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-green-300 hover:from-green-600 hover:to-emerald-700 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <span>✅</span> Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </QueueCard>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
