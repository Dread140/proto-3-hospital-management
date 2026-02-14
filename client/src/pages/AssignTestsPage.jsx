import { useEffect, useState } from 'react';
import { getPatients, createTests } from '../api/client';

const TEST_OPTIONS = [
    { value: 'vision', label: 'Vision Test', duration: '5 min' },
    { value: 'refraction', label: 'Refraction Test', duration: '10 min' },
    { value: 'iop', label: 'IOP Test', duration: '5 min' },
    { value: 'oct', label: 'OCT Test', duration: '15 min' },
    { value: 'field', label: 'Field Test', duration: '20 min' },
    { value: 'preop', label: 'Pre-op Test', duration: '25 min' }
];

export default function AssignTestsPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedTests, setSelectedTests] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            const registeredPatients = data.filter(p => p.current_stage === 'registered');
            setPatients(registeredPatients);
            setError('');
        } catch (err) {
            setError('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const handleTestToggle = (testValue) => {
        setSelectedTests(prev =>
            prev.includes(testValue)
                ? prev.filter(t => t !== testValue)
                : [...prev, testValue]
        );
    };

    const handleAssignTests = async () => {
        if (!selectedPatient) {
            setError('Please select a patient');
            return;
        }
        if (selectedTests.length === 0) {
            setError('Please select at least one test');
            return;
        }

        setError('');
        setSuccess('');

        try {
            await createTests(selectedPatient.id, selectedTests);
            setSuccess(`Successfully assigned ${selectedTests.length} test(s) to ${selectedPatient.name}`);
            setSelectedPatient(null);
            setSelectedTests([]);
            await fetchPatients();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to assign tests');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Assign Tests</h1>
                <p className="text-gray-600">Select a patient and assign diagnostic tests</p>
            </div>

            {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                    <p className="text-green-700">{success}</p>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {patients.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
                    <span className="text-6xl mb-4 block">📋</span>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No patients awaiting test assignment</h3>
                    <p className="text-gray-500">All registered patients have been assigned tests!</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Patient Selection */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Patient</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {patients.map((patient) => (
                                <div
                                    key={patient.id}
                                    onClick={() => setSelectedPatient(patient)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPatient?.id === patient.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                            <p className="text-sm text-gray-600">Token: #{patient.token_number} | UHID: {patient.uhid}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${patient.priority_level === 'emergency' ? 'bg-red-100 text-red-700' :
                                                patient.priority_level === 'vip' ? 'bg-purple-100 text-purple-700' :
                                                    patient.priority_level === 'senior' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                            }`}>
                                            {patient.priority_level.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Test Selection */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Tests</h2>

                        {selectedPatient ? (
                            <>
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-900">
                                        <strong>Patient:</strong> {selectedPatient.name}
                                    </p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {TEST_OPTIONS.map((test) => (
                                        <label
                                            key={test.value}
                                            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedTests.includes(test.value)
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTests.includes(test.value)}
                                                    onChange={() => handleTestToggle(test.value)}
                                                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{test.label}</p>
                                                    <p className="text-sm text-gray-600">Duration: {test.duration}</p>
                                                </div>
                                            </div>
                                            {selectedTests.includes(test.value) && (
                                                <span className="text-green-600">✓</span>
                                            )}
                                        </label>
                                    ))}
                                </div>

                                <button
                                    onClick={handleAssignTests}
                                    disabled={selectedTests.length === 0}
                                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Assign {selectedTests.length} Test{selectedTests.length !== 1 ? 's' : ''}
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <span className="text-4xl block mb-2">👈</span>
                                <p>Please select a patient first</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
