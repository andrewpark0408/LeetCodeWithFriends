import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event: any) => {
        event.preventDefault();
        setError(''); // Clear previous errors
        try {
            const response = await axios.post('http://localhost:3001/api/users/register', {
                username,
                email,
                password,
            });
            console.log('User registered successfully:', response.data);
            navigate('/login'); // Navigate on successful registration
        } catch (error: any) {
            if (error.response) {
                // Handle errors sent back by the server
                setError(error.response.data.error || 'Failed to register. Please try again.');
            } else {
                setError('Registration failed. Please check your network connection.');
            }
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleRegister}>
                <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                        <input className="input" type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input className="input" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input className="input" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </div>
                {error && <p className="help is-danger">{error}</p>}
                <div className="control">
                    <button className="button is-primary">Register</button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;
