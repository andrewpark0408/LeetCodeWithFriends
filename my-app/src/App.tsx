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
    const [currentUser, setCurrentUser] = useState(null);  // Define currentUser state

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.userId) {
            setCurrentUser(userData);
            setIsAuthenticated(true);
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
        }} /> },
        { path: "/register", element: <RegisterPage /> },
        { path: "/editor", element: <EditorPage /> },
        { path: "/groups", element: <GroupPage isAuthenticated={isAuthenticated} /> },
    ]);

    return (
        <UserProvider value={{ currentUser, setCurrentUser }}>
            {routes}
        </UserProvider>
    );
}

export default App;
