import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import './index.css';
import Users from './pages/admin-menu/Users';
import Login from './pages/auth/Login';
import PastPerformance from './pages/admin-menu/PastPerformance';

const MyContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // Store the login status in localStorage
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  // Check if the user is logged in on initial render
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []); // Run only once when the component mounts

  return (
    <MyContext.Provider value={{ isLoggedIn, handleLoginSuccess, handleLogout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<MainApp isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
        </Routes>
      </BrowserRouter>
    </MyContext.Provider>
  );
}

function MainApp({ isLoggedIn, handleLogout }) {
  const navigate = useNavigate(); // Use navigate here for redirection

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [isLoggedIn, navigate]);

  return (

    <section className="main flex">

      {isLoggedIn && (
        <div className="sideBarWrapper w-full sm:w-[20%] p-4">
          <Sidebar handleLogout={handleLogout} />
        </div>
      )}
      <div className="content_Right w-full sm:w-[80%] px-4">

        <Routes>
          {/* Redirect logged-in users trying to access /login */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
          />
          {/* Protected routes */}
          <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/users" element={isLoggedIn ? <Users /> : <Navigate to="/login" replace />} />
          <Route path="/past-performance" element={isLoggedIn ? <PastPerformance /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </section>
  );
}

export default App;
export { MyContext };
