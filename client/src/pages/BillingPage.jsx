import { useEffect, useState } from 'react';
import { getPatients, createBill, payBill } from '../api/client';
import BillInvoice from '../components/BillInvoice';

export default function BillingPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [billAmount, setBillAmount] = useState({});
    const [generatedBills, setGeneratedBills] = useState({}); // Store generated bills for invoice view
    const [viewingInvoice, setViewingInvoice] = useState(null); // { bill, patient }

    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            // In a real app we might fetch bills separately, or patient object would have billing info
            // For now, filtering by 'billing' stage
            const billingQueue = data.filter(p => p.current_stage === 'billing');
            setPatients(billingQueue);
            setError('');
        } catch (err) {
            setError('Failed to load billing queue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
        const interval = setInterval(fetchPatients, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateBill = async (patientId) => {
        const amount = billAmount[patientId];
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            const res = await createBill({ patient_id: patientId, amount: parseFloat(amount) });
            // Store the bill info to show invoice
            const billData = {
                id: res.id,
                amount: parseFloat(amount),
                status: 'pending'
            };
            setGeneratedBills(prev => ({ ...prev, [patientId]: billData }));
            await fetchPatients();
        } catch (err) {
            alert('Failed to create bill');
        }
    };

    const handlePayBill = async (billId, patientId) => {
        const paymentMode = prompt('Enter payment mode (cash/card/upi):');
        if (!paymentMode) return;

        try {
            await payBill(billId, { payment_mode: paymentMode });
            await fetchPatients();
            // Clear generated bill from local state if paid
            setGeneratedBills(prev => {
                const newState = { ...prev };
                delete newState[patientId];
                return newState;
            });
        } catch (err) {
            alert('Failed to process payment');
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
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-500 mb-3">
                    Billing & Payments
                </h1>
                <p className="text-lg text-gray-600 font-medium">Manage patient invoices and process payments efficiently.</p>
            </div>

            {error && (
                <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {patients.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
                    <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">💰</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">All Clear!</h3>
                    <p className="text-gray-500 text-lg">No pending bills in the queue currently.</p>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-2">
                    {patients.map((patient) => (
                        <div key={patient.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium">UHID: {patient.uhid}</p>
                                </div>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Token #{patient.token_number}
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Age/Gender</span>
                                        <span className="font-semibold text-gray-700 text-base">{patient.age} Y / {patient.gender}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Contact</span>
                                        <span className="font-semibold text-gray-700 text-base">{patient.phone}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    {generatedBills[patient.id] ? (
                                        <div className="animate-fade-in-up">
                                            <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-100 flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-green-600 font-bold uppercase mb-1">Total Due</p>
                                                    <p className="text-2xl font-bold text-green-700">₹{generatedBills[patient.id].amount}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-semibold">PENDING</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setViewingInvoice({ bill: generatedBills[patient.id], patient })}
                                                    className="flex-1 px-4 py-3 bg-white border border-blue-200 text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-sm"
                                                >
                                                    📄 View Invoice
                                                </button>
                                                <button
                                                    onClick={() => handlePayBill(generatedBills[patient.id].id, patient.id)}
                                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5"
                                                >
                                                    💳 Mark Paid
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Billing Amount (₹)</label>
                                                <div className="relative rounded-xl shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={billAmount[patient.id] || ''}
                                                        onChange={(e) => setBillAmount({ ...billAmount, [patient.id]: e.target.value })}
                                                        placeholder="0.00"
                                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-lg border-gray-300 rounded-xl py-3"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleCreateBill(patient.id)}
                                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
                                            >
                                                Generate Bill
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {viewingInvoice && (
                <BillInvoice
                    bill={viewingInvoice.bill}
                    patient={viewingInvoice.patient}
                    onClose={() => setViewingInvoice(null)}
                />
            )}
        </div>
    );
}
