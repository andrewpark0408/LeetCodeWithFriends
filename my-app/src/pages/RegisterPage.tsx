import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/register', {
                username,
                email,
                password,
            });
            console.log('User registered successfully:', response.data);
            // You can redirect or show a success message here
        } catch (error) {
            console.error('Error registering user:', error.response.data);
            // Handle error (e.g., show error message to user)
        }
        navigate('/login');
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
              <div className="control">
                  <button className="button is-primary">Register</button>
              </div>
          </form>
      </div>
    );
}

export default RegisterPage;
