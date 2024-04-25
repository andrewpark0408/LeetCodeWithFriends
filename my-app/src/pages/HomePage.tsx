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
        <Layout
            title="Home"
            isAuthenticated={isAuthenticated}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            handleNavigate={handleNavigate}
        >
            <section className="hero is-primary is-bold">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">Welcome to Leet Code With Friends!</h1>
                    <h2 className="subtitle">Improve your coding skills with friends.</h2>
                </div>
            </div>
        </section>

        <section className="section">
            <div className="container">
                <h2 className="title">Why Leet Code With Friends?</h2>
                <p>Leet Code With Friends provides a platform for you to practice coding problems and learn from your friends. You can create groups, share problems, and discuss solutions.</p>
            </div>
        </section>
        </Layout>
    );
}

export default HomePage;