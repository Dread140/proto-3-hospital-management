import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊', roles: ['admin', 'receptionist', 'technician', 'doctor', 'billing'] },
    { path: '/register', label: 'Registration', icon: '➕', roles: ['admin', 'receptionist'] },
    { path: '/assign-tests', label: 'Assign Tests', icon: '📋', roles: ['admin', 'receptionist', 'technician'] },
    { path: '/screening', label: 'Screening', icon: '🔬', roles: ['admin', 'technician'] },
    { path: '/consultation', label: 'Consultation', icon: '👨‍⚕️', roles: ['admin', 'doctor'] },
    { path: '/billing', label: 'Billing', icon: '💰', roles: ['admin', 'billing'] },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-green-900 text-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
              <span className="text-2xl">👁️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Sankara EyeCare</h1>
              <p className="text-xs text-blue-200">Pro System</p>
            </div>
          </div>

          {user && (
            <div className="mb-6 p-4 bg-white/10 rounded-lg backdrop-blur">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-blue-200 capitalize">{user.role}</p>
            </div>
          )}

          <nav className="space-y-2">
            {visibleMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${location.pathname === item.path
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'hover:bg-white/10'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={logout}
            className="mt-8 w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-all border border-white/20"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

