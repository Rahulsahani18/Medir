import React from 'react';

const NotFoundPage = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      textAlign: 'center',
    },
    title: {
      fontSize: '120px',
      fontWeight: 'bold',
      color: '#dc3545',
      margin: '0',
      lineHeight: '1',
    },
    subtitle: {
      fontSize: '32px',
      color: '#343a40',
      margin: '20px 0',
    },
    text: {
      fontSize: '18px',
      color: '#6c757d',
      maxWidth: '600px',
      marginBottom: '40px',
      lineHeight: '1.6',
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    primaryButton: {
      padding: '12px 24px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    secondaryButton: {
      padding: '12px 24px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <h2 style={styles.subtitle}>Oops! Page Not Found</h2>
      <p style={styles.text}>
        We're sorry, but the page you're looking for doesn't exist. 
        It might have been moved or deleted.
      </p>
      <div style={styles.buttonGroup}>
        <button 
          style={styles.primaryButton}
          onClick={() => window.location.href = '/'}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Go to Homepage
        </button>
        <button 
          style={styles.secondaryButton}
          onClick={() => window.history.back()}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#545b62'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;