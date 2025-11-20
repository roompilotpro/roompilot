import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { messageService } from '../services/api';
import MessageList from '../components/MessageList';
import './TestPage.css';

/**
 * Full-stack test page to verify database connectivity.
 * Tests message CRUD operations.
 */
const TestPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsAuthError(false);
      const response = await messageService.getAllMessages();
      setMessages(response.data);
    } catch (err) {
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setIsAuthError(true);
        setError('The message API requires authentication to access.');
      } else {
        setIsAuthError(false);
        setError(err.response?.data?.message || err.message || 'Failed to fetch messages');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleCreateMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setCreating(true);
      await messageService.createMessage(newMessage);
      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setIsAuthError(true);
        setError('Authentication required to create messages.');
      } else {
        setIsAuthError(false);
        setError(err.response?.data?.message || err.message || 'Failed to create message');
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="test-page">
      {/* Header */}
      <header className="test-header">
        <div className="container">
          <nav>
            <Link to="/" className="logo">🚀 RoomPilot</Link>
            <div className="nav-menu">
              <Link to="/">Home</Link>
              <Link to="/login" className="btn-gradient">Login</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="test-content">
        <div className="container">
          <div className="test-hero">
            <h1>Full Stack Test Page</h1>
            <p>Testing database connectivity and CRUD operations</p>
            <div className="tech-badge">
              <span className="badge">Spring Boot</span>
              <span className="badge">React</span>
              <span className="badge">PostgreSQL</span>
            </div>
          </div>

          {/* Create Message Form */}
          <div className="test-card create-section">
            <h2>Create New Message</h2>
            <form onSubmit={handleCreateMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter your message..."
                disabled={creating}
                className="message-input"
              />
              <button
                type="submit"
                disabled={creating || !newMessage.trim()}
                className="btn-gradient"
              >
                {creating ? 'Creating...' : 'Create Message'}
              </button>
            </form>
          </div>

          {/* Messages List */}
          <div className="test-card messages-section">
            <div className="section-header-small">
              <h2>Messages from Database</h2>
              <button
                onClick={fetchMessages}
                disabled={loading}
                className="refresh-btn"
              >
                {loading ? 'Refreshing...' : '🔄 Refresh'}
              </button>
            </div>

            {isAuthError ? (
              <div className="auth-error-card">
                <div className="auth-icon">🔒</div>
                <h3>Authentication Required</h3>
                <p>{error}</p>
                <p className="auth-help">
                  Please log in to test the message API, or configure your backend to allow public access to the message endpoints.
                </p>
                <button onClick={() => navigate('/login')} className="btn-gradient">
                  Go to Login
                </button>
              </div>
            ) : (
              <MessageList messages={messages} loading={loading} error={error} />
            )}
          </div>

          {/* Connection Status */}
          <div className="test-card status-section">
            <h3>Connection Status</h3>
            <div className="status-grid">
              <div className="status-item">
                <div className={`status-indicator ${!error ? 'active' : 'inactive'}`}></div>
                <span>Backend API</span>
              </div>
              <div className="status-item">
                <div className={`status-indicator ${messages.length > 0 ? 'active' : 'inactive'}`}></div>
                <span>Database</span>
              </div>
              <div className="status-item">
                <div className="status-indicator active"></div>
                <span>Frontend</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
