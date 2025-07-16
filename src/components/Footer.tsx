import type React from "react"

const Footer: React.FC = () => {
  return (
    <footer style={{ 
      backgroundColor: '#a3c2d4', 
      padding: '40px 0 20px 0', 
      color: '#003b5b', 
      fontSize: '0.95em',
      width: '100%',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        width: '100%',
        margin: '0', 
        gap: '100px',
        padding: '0 80px 0 80px',
        boxSizing: 'border-box'
      }}>
        
        {/* Logo Section */}
        <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
          <img 
            src="https://cdn-icons-png.flaticon.com/128/8224/8224757.png" 
            alt="QuLearn Logo" 
            style={{ width: '50px', marginBottom: '10px' }}
          />
          <p style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '10px' }}>QuLearn</p>
          <p style={{ marginBottom: '10px' }}></p>
          <p style={{ marginTop: '10px', lineHeight: 1.5, textAlign: 'justify', textJustify: 'inter-word' }}>
            An immersive quantum computing learning platform offering interactive simulators, gamified learning,
            and expert-driven content.
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <a href="#" style={{ color: '#003b5b', textDecoration: 'none' }}>Home</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#" style={{ color: '#003b5b', textDecoration: 'none' }}>About</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#" style={{ color: '#003b5b', textDecoration: 'none' }}>Courses</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#" style={{ color: '#003b5b', textDecoration: 'none' }}>Contact</a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Support</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <a href="#" style={{ color: '#003b5b', textDecoration: 'none' }}>Help Center</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#" style={{ color: '#003b5b', textDecoration: 'none' }}>Terms of Service</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#" style={{ color: '#003b5b', textDecoration: 'none' }}>Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Connect With Us</h4>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginTop: '10px' 
          }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/733/733547.png" 
                alt="Facebook" 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  transition: 'transform 0.2s ease' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" 
                alt="Instagram" 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  transition: 'transform 0.2s ease' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/145/145807.png" 
                alt="LinkedIn" 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  transition: 'transform 0.2s ease' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/733/733579.png" 
                alt="Twitter" 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  transition: 'transform 0.2s ease' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" 
                alt="YouTube" 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  transition: 'transform 0.2s ease' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </a>
            <a href="https://wa.me/94712345678" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/733/733585.png" 
                alt="WhatsApp" 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  transition: 'transform 0.2s ease' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px', 
        borderTop: '1px solid #6899af', 
        paddingTop: '10px', 
        color: '#003b5b',
        width: '100%',
        padding: '10px 80px 0 80px',
        margin: '30px 0 0 0',
        boxSizing: 'border-box'
      }}>
        <p>© 2025 QuLearn. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer