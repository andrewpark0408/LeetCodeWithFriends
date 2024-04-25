import React from 'react';

const Layout = ({ children, title, isAuthenticated, handleLogin, handleLogout, handleNavigate }) => {
    return (
        <div className="container">
            <h1>{title}</h1>
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
            {children}
        </div>
    );
};

export default Layout;