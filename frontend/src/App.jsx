import { useState, useEffect } from 'react';
import { messageService } from './services/api';
import MessageList from './components/MessageList';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messageService.getAllMessages();
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch messages: ' + err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await messageService.createMessage(newMessage);
      setNewMessage('');
      fetchMessages(); // Refresh the list
    } catch (err) {
      setError('Failed to create message: ' + err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World - Full Stack App</h1>
        <p className="tech-stack">
          Java Spring Boot + React + Neon Postgres
        </p>
      </header>
      
      <main className="main-content">
        <section className="create-message">
          <h2>Add New Message</h2>
          <form onSubmit={handleCreateMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your message..."
              maxLength="255"
            />
            <button type="submit">Add Message</button>
          </form>
        </section>

        <section className="messages-section">
          <h2>Messages from Database</h2>
          <MessageList messages={messages} loading={loading} error={error} />
          {!loading && !error && (
            <button onClick={fetchMessages} className="refresh-btn">
              Refresh Messages
            </button>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
