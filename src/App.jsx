import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import './index.css';
import Users from './pages/admin-menu/Users';
import Login from './pages/auth/Login';
import AddExitedCall from './pages/admin-menu/past_performance/AddExitedCall';
import PastPerformance from './pages/admin-menu/past_performance/PastPerformance';

const MyContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Add state for mobile sidebar

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <MyContext.Provider value={{
      isLoggedIn,
      handleLoginSuccess,
      handleLogout,
      isSidebarOpen,
      setIsSidebarOpen
    }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <MainApp
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </MyContext.Provider>
  );
}

function MainApp({ isLoggedIn, handleLogout, isSidebarOpen, setIsSidebarOpen }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Don't render the layout if not logged in
  if (!isLoggedIn && window.location.pathname !== '/login') {
    return null;
  }

  // For login page, render without layout
  if (window.location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen  dark:bg-gray-900">
      {/* Mobile Header with Menu Button */}
      {isLoggedIn && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 dark:bg-gray-800 border-b dark:border-gray-700 z-30 px-4">
          <div className="h-full flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                className="w-6 h-6 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            {/* Add your logo or site title here */}
          </div>
        </div>
      )}

      <div className="flex h-screen pt-16 lg:pt-0">
        {/* Sidebar */}
        {isLoggedIn && (
          <div
            className={`
              fixed lg:static inset-y-0 left-0 z-20
              transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0 transition-transform duration-200 ease-in-out
              w-64 dark:bg-gray-800 border-r dark:border-gray-700
              overflow-y-auto
            `}
          >
            <Sidebar handleLogout={handleLogout} />
          </div>
        )}

        {/* Main Content */}
        <div className={`
          flex-1 overflow-y-auto
          ${isLoggedIn ? 'lg:ml-0' : ''}
          px-4 py-6
          transition-all duration-200
        `}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/past-performance" element={<PastPerformance />} />
            <Route path="/past-performance/exited-call/add" element={<AddExitedCall />} />
          </Routes>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isLoggedIn && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
export { MyContext };