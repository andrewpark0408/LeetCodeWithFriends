import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        // Here you would handle the login logic, possibly including an API call.
        console.log(email, password);
        // On successful login, navigate to another page, e.g., the editor or group page.
        navigate('/editor');
    };

    return (
        <div className="container">
            <form onSubmit={handleLogin}>
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input className="input" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                </div>
                <div className="field">
                        <label className="label">
                            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                            Remember Me
                        </label>
                    <div className="control">
                        <input className="input" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </div>
                <div className="control">
                    <button className="button is-primary">Login</button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
