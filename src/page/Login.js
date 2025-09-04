import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token); // Save token if returned
      localStorage.setItem('username', formData.username);
localStorage.setItem('user_id', '1'); // Replace with user ID if you have it
navigate('/users');
      alert('Login successful');
      // Navigate to chat page later
    } else {
      alert('Login failed');
    }
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Login</h2>
        <input name="username" type="text" placeholder="Username" onChange={handleChange} className="w-full p-2 border mb-3 rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border mb-4 rounded" />
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
        <p className="mt-4 text-sm text-center">
          Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
