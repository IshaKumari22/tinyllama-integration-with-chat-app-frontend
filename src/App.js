import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/page/Login';
import Register from '../src/page/Resister';
import UserList from '../src/page/UserList';
import ChatPage from '../src/page/ChatPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserList />} />
        
<Route path="/chat/:threadId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
