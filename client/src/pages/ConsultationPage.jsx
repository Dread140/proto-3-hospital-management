import { useEffect, useState } from 'react';
import { getPatients, startConsultation, endConsultation } from '../api/client';
import QueueCard from '../components/QueueCard';
import { useAuth } from '../context/AuthContext';

export default function ConsultationPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            const doctorQueue = data.filter(p => p.current_stage === 'doctor');
            setPatients(doctorQueue);
            setError('');
        } catch (err) {
            setError('Failed to load patient queue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
        const interval = setInterval(fetchPatients, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleStartConsultation = async (patientId) => {
        try {
            await startConsultation(patientId);
            await fetchPatients();
        } catch (err) {
            alert('Failed to start consultation');
        }
    };

    const handleEndConsultation = async (patientId) => {
        try {
            await endConsultation(patientId);
            await fetchPatients();
        } catch (err) {
            alert('Failed to end consultation');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Consultation</h1>
                <p className="text-gray-600">Manage patient consultations</p>
                {user && <p className="text-sm text-gray-500 mt-1">Dr. {user.name}</p>}
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {patients.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
                    <span className="text-6xl mb-4 block">👨‍⚕️</span>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No patients waiting</h3>
                    <p className="text-gray-500">All consultations completed!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {patients.map((patient) => (
                        <QueueCard key={patient.id} patient={patient}>
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                    <span className="text-gray-600">UHID:</span>
                                    <span className="ml-2 font-semibold text-gray-900">{patient.uhid}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Age:</span>
                                    <span className="ml-2 font-semibold text-gray-900">{patient.age} years</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Gender:</span>
                                    <span className="ml-2 font-semibold text-gray-900">{patient.gender}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="ml-2 font-semibold text-gray-900">{patient.phone}</span>
                                </div>
                            </div>

                            <div className={`mb-4 px-3 py-2 rounded-lg text-sm font-semibold ${patient.status === 'in_progress'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                Status: {patient.status === 'in_progress' ? '▶️ In Consultation' : '⏸️ Waiting'}
                            </div>

                            <div className="flex space-x-3">
                                {patient.status === 'waiting' && (
                                    <button
                                        onClick={() => handleStartConsultation(patient.id)}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all"
                                    >
                                        ▶️ Start Consultation
                                    </button>
                                )}
                                {patient.status === 'in_progress' && (
                                    <button
                                        onClick={() => handleEndConsultation(patient.id)}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
                                    >
                                        ✅ End Consultation
                                    </button>
                                )}
                            </div>
                        </QueueCard>
                    ))}
                </div>
            )}
        </div>
    );
}
