import React from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC<{ isAuthenticated: boolean; onLogout: () => void }> = ({ isAuthenticated, onLogout }) => {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const handleLogin = async () => {
        handleNavigate('/login');
    };

    const handleLogout = async () => {
        onLogout();
    };

    return (
        <div className="container">
            <h1>Welcome to LeetCode with Friends</h1>
            <div className="buttons">
                {!isAuthenticated && (
                    <>
                        <button className="button is-primary" onClick={handleLogin}>Login</button>
                        <button className="button is-link" onClick={() => handleNavigate('/register')}>Register</button>
                    </>
                )}
                {isAuthenticated && (
                    <button className="button is-danger" onClick={handleLogout}>Logout</button>
                )}
                <button className="button is-info" onClick={() => handleNavigate('/groups')}>My Groups</button>
                <button className="button is-info" onClick={() => handleNavigate('/editor')}>Editor</button>
            </div>
        </div>
    );
}

export default HomePage;