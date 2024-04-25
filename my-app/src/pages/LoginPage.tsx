import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function LoginPage({ onLogin, setIsAuthenticated, setCurrentUser }: { onLogin: (userData: any) => void, setIsAuthenticated: Function, setCurrentUser: Function }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event: any) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/users/login', {
                email,
                password
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 200) {
                throw new Error('Login failed');
            }

            const userData = response.data;
            console.log('user data:', userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setIsAuthenticated(true); // Set isAuthenticated state to true
            setCurrentUser(userData); // Set current user data
            onLogin(userData); // Call onLogin with userData
            console.log('Navigating to home/dashboard');
            navigate('/'); // Navigate to home or dashboard
        } catch (error) {
            console.error('Login failed:', error);
            // Handle error, show message, etc.
        }
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
