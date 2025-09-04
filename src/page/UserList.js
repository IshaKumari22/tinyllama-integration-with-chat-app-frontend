import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('http://127.0.0.1:8000/api/users/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        alert('Failed to fetch users');
      }
    };

    fetchUsers();
  }, [token]);

  const startChat = async (userId) => {
    const res = await fetch(`http://127.0.0.1:8000/api/chat/thread/${userId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    if (res.ok) {
      const thread = await res.json();
      navigate(`/chat/${thread.id}`);  // go to chat screen
    } else {
      alert('Error starting chat');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
          <div className="text-sm text-gray-600 p-2">
    👤 Logged in as: <strong>{username}</strong>
  </div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="space-y-2">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-white p-4 rounded shadow hover:bg-blue-50 cursor-pointer"
            onClick={() => startChat(user.id)}
          >
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
