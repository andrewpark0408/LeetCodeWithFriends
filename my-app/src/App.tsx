import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // Import UserProvider
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GroupPage from './pages/GroupPage';
import EditorPage from './pages/EditorPage';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<null | { [key: string]: any }>(null);

    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}'); // Added fallback to '{}' to ensure JSON.parse doesn't throw an error for null
            if (userData && userData.userId) {
                setCurrentUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Failed to parse user data from localStorage:', error);
        }
    }, []);

    const routes = useRoutes([
        { path: "/", element: <HomePage isAuthenticated={isAuthenticated} onLogout={() => {
            localStorage.removeItem('user');  // Use the same key 'user'
            setIsAuthenticated(false);
            setCurrentUser(null);  // Reset currentUser
        }} /> },
        { path: "/login", element: <LoginPage onLogin={(userData) => {
            localStorage.setItem('user', JSON.stringify(userData)); // Save user data to local storage
            setIsAuthenticated(true);
            setCurrentUser(userData);  // Set current user data
        }} setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser} /> },
        { path: "/register", element: <RegisterPage /> },
        { path: "/editor", element: <EditorPage /> },
        { path: "/groups", element: <GroupPage isAuthenticated={isAuthenticated} handleLogin={() => { console.log('handleLogin'); }} handleLogout={() => { console.log('handleLogout'); }} handleNavigate={() => { console.log('handleNavigate'); }} /> },
    ]);

    return (
        <UserProvider user={currentUser} setUser={setCurrentUser}>
            {routes}
        </UserProvider>
    );
};
export default App;