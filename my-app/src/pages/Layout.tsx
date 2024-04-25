import { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
    title: string;
    isAuthenticated: boolean;
    handleLogin: () => void;
    handleLogout: () => void;
    handleNavigate: (path: string) => void;
};

const Layout = ({ children, title, isAuthenticated, handleLogin, handleLogout, handleNavigate }: LayoutProps) => {
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