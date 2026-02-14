import { useState } from 'react';
import { createPatient } from '../api/client';

export default function RegistrationPage() {
    const [formData, setFormData] = useState({
        uhid: '',
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        priority_level: 'normal'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(null);
        setLoading(true);

        try {
            const data = await createPatient({
                ...formData,
                age: parseInt(formData.age)
            });
            setSuccess(data);
            setFormData({ uhid: '', name: '', age: '', gender: 'Male', phone: '', priority_level: 'normal' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Registration</h1>
                <p className="text-gray-600">Register a new patient into the system</p>
            </div>

            {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-lg animate-fade-in">
                    <div className="flex items-center mb-2">
                        <span className="text-3xl mr-3">✅</span>
                        <h3 className="text-lg font-bold text-green-800">Registration Successful!</h3>
                    </div>
                    <p className="text-green-700 text-lg">
                        Token Number: <span className="font-bold text-2xl">#{success.token_number}</span>
                    </p>
                    <p className="text-green-600 text-sm mt-2">Patient ID: {success.id}</p>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                UHID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.uhid}
                                onChange={(e) => setFormData({ ...formData, uhid: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="e.g., UH2024001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Patient Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Age <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                required
                                min="0"
                                max="120"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Age"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="+91 XXXXXXXXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Priority Level <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.priority_level}
                                onChange={(e) => setFormData({ ...formData, priority_level: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            >
                                <option value="normal">Normal</option>
                                <option value="senior">Senior Citizen</option>
                                <option value="vip">VIP</option>
                                <option value="emergency">Emergency</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => setFormData({ uhid: '', name: '', age: '', gender: 'Male', phone: '', priority_level: 'normal' })}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registering...' : 'Register Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
