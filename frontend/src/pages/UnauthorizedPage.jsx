import { Link } from 'react-router-dom';

/**
 * 403 Unauthorized page.
 * Displayed when user tries to access a resource they don't have permission for.
 */
const UnauthorizedPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '4rem', margin: '0', color: '#f44336' }}>403</h1>
        <h2>Access Denied</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          You don't have permission to access this page.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
