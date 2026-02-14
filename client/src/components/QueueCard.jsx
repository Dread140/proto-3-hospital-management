const PRIORITY_COLORS = {
    emergency: 'bg-red-100 border-red-500 text-red-900',
    vip: 'bg-purple-100 border-purple-500 text-purple-900',
    senior: 'bg-yellow-100 border-yellow-500 text-yellow-900',
    normal: 'bg-blue-100 border-blue-500 text-blue-900'
};

const PRIORITY_BADGES = {
    emergency: '🚨 Emergency',
    vip: '⭐ VIP',
    senior: '👴 Senior',
    normal: '👤 Normal'
};

export default function QueueCard({ patient, children }) {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{patient.patient_name || patient.name}</h3>
                    <p className="text-sm text-gray-600">Token: #{patient.token_number}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${PRIORITY_COLORS[patient.priority_level]}`}>
                    {PRIORITY_BADGES[patient.priority_level]}
                </span>
            </div>
            {children}
        </div>
    );
}
