import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <div className="container">
            <h1>Welcome to LeetCode with Friends</h1>
            <div className="buttons">
                {!isAuthenticated && (
                    <>
                        <button className="button is-primary" onClick={() => handleNavigate('/login')}>Login</button>
                        <button className="button is-link" onClick={() => handleNavigate('/register')}>Register</button>
                    </>
                )}
                {isAuthenticated && (
                    <button className="button is-danger" onClick={() => handleNavigate('/logout')}>Logout</button>
                )}
                <button className="button is-info" onClick={() => handleNavigate('/groups')}>My Groups</button>
                <button className="button is-info" onClick={() => handleNavigate('/editor')}>Editor</button>
            </div>
        </div>
    );
}

export default HomePage;
