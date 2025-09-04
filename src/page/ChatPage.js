// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import ChatRoom from '../components/ChatRoom';

// const ChatPage = () => {
//   const { threadId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const socketRef = useRef(null);

//   const userId = localStorage.getItem('user_id');
//   const username = localStorage.getItem('username');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await fetch(`http://127.0.0.1:8000/api/chat/messages/${threadId}/`, {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });
//         const data = await res.json();
//         setMessages(data);
//       } catch (err) {
//         console.error('Error fetching messages:', err);
//       }
//     };

//     fetchMessages();
//   }, [threadId, token]);

//   useEffect(() => {
//     const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${threadId}/`);
//     socketRef.current = socket;

//     socket.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       setMessages((prev) => [...prev, data]);
//     };

//     return () => socket.close();
//   }, [threadId]);

//   const sendMessage = () => {
//     if (text.trim() && socketRef.current) {
//       socketRef.current.send(
//         JSON.stringify({
//           message: text,
//           sender_id: userId,
//         })
//       );
//       setText('');
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen p-4 bg-gray-100">
//       <div className="mb-2 text-right text-sm text-gray-600">
//         👤 Logged in as: <strong>{username}</strong>
//       </div>

//       <ChatRoom
//         messages={messages}
//         text={text}
//         setText={setText}
//         sendMessage={sendMessage}
//         currentUser={username}
//       />
//     </div>
//   );
// };

// export default ChatPage;






import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { threadId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const messagesEndRef = useRef(null);

  // Fetch old messages
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/chat/messages/${threadId}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    })();
  }, [threadId, token]);

  // WebSocket for real-time chat
  useEffect(() => {
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${threadId}/`);
    socketRef.current = socket;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => socket.close();
  }, [threadId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (text.trim() && socketRef.current) {
      socketRef.current.send(JSON.stringify({ message: text, sender_id: userId }));
      setText('');
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      {/* Header */}
      <div className="mb-2 text-right text-sm text-gray-600">
        👤 Logged in as: <strong>{username}</strong>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 mb-4 space-y-2">
        {messages.map((msg, i) => {
          const isSender = msg.sender?.username === username || msg.sender === username;
          return (
            <div key={i} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-3 rounded-lg max-w-xs break-words shadow-md ${
                  isSender
                    ? 'bg-blue-500 text-white rounded-br-none self-end'
                    : 'bg-gray-300 text-black rounded-bl-none self-start'
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {msg.sender?.username || (isSender ? 'You' : '')}
                </div>
                <div className="text-base">{msg.message || msg.text}</div>
                <div className="text-xs mt-1 text-gray-600 text-right">
                  {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
