import React from 'react';

const Footer = () => (
  <footer style={{
    background: '#222',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem 0',
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 1000
  }}>
    <div>
      &copy; {new Date().getFullYear()} Online Banking System &mdash; All rights reserved.
    </div>
  </footer>
);

export default Footer; 