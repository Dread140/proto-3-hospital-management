import React from 'react';

export default function BillInvoice({ bill, patient, onClose }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:p-0 print:bg-white print:inset-auto print:static">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden print:shadow-none print:w-full print:max-w-none">

                {/* Header */}
                <div className="bg-blue-900 text-white p-8 print:bg-white print:text-black print:border-b-2 print:border-gray-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Sankara Eye Hospital</h1>
                            <p className="text-blue-100 print:text-gray-600">Excellence in Eye Care</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-semibold mb-1">INVOICE</h2>
                            <p className="text-blue-100 print:text-gray-600">#{bill.id.toString().padStart(6, '0')}</p>
                            <p className="text-sm text-blue-200 print:text-gray-500 mt-2">
                                Date: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="p-8 border-b border-gray-100">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Billed To</h3>
                            <p className="text-lg font-bold text-gray-900">{patient.name}</p>
                            <p className="text-gray-600">UHID: {patient.uhid}</p>
                            <p className="text-gray-600">Phone: {patient.phone}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Payment Status</h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${bill.status === 'paid'
                                    ? 'bg-green-100 text-green-700 print:text-green-800 print:bg-transparent print:border print:border-green-800'
                                    : 'bg-yellow-100 text-yellow-700 print:text-yellow-800 print:bg-transparent print:border print:border-yellow-800'
                                }`}>
                                {bill.status.toUpperCase()}
                            </span>
                            {bill.payment_mode && (
                                <p className="text-gray-600 mt-2">Mode: {bill.payment_mode.toUpperCase()}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bill Items */}
                <div className="p-8">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm uppercase text-gray-500 border-b border-gray-200">
                                <th className="pb-4">Description</th>
                                <th className="pb-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            <tr>
                                <td className="py-4">Medical Services / Consultation</td>
                                <td className="py-4 text-right">₹{bill.amount.toFixed(2)}</td>
                            </tr>
                            {/* Added placeholder for taxes or other charges if needed */}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-gray-900 text-gray-900 font-bold text-lg">
                                <td className="pt-4">Total</td>
                                <td className="pt-4 text-right">₹{bill.amount.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-8 border-t border-gray-100 print:bg-white print:border-t-0">
                    <div className="text-center text-gray-500 text-sm mb-6">
                        <p>Thank you for choosing Sankara Eye Hospital.</p>
                        <p>For any queries, please contact billing@sankara.com</p>
                    </div>

                    <div className="flex gap-4 justify-end print:hidden">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-6 py-2 rounded-lg bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors flex items-center gap-2"
                        >
                            <span>🖨️</span> Print Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
