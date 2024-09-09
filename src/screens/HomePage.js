import React from 'react';
import { useNavigate } from 'react-router-dom';
import landing_page_img from '../images/landing_page.png';
import back_img from '../images/back_img.png';

export default function HomePage() {
  const navigate = useNavigate();

  const handleContinueClick = () => {
    // Add logic here if needed before navigating
    navigate('/signin');
  };

  return (
    <div
      style={{
        textAlign: 'center',
        backgroundImage: `url(${back_img})`,
        backgroundSize: 'cover',
        resizeMode: 'contain',
        repeat: 'no-repeat',

    
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', // Change from '100vh' to '100vw' for full viewport width
        height: '100%',
        fontFamily:"Merriweather",
        paddingTop: '50px',
      }}
    >
      <div
        style={{
        //   border: '1px solid #3498db',
          width: '40%',
            height: '100%',
          padding: '30px',
            paddingLeft: '70px',
            paddingRight: '10px',
            display: 'flex',
            marginLeft: '20px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            // display: 'flex',
          
        }}
      >
      <div
      style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '70%',
            height: '100%',
      }}
      >
      <h1
        style={{
            fontSize: '2.3rem',
            // fontWeight: 'bold',
            fontFamily:"Merriweather",
            color: '#3498db',
            marginBottom: '20px',
        }}
        >E-Pharma</h1>
        <p
        
        style={{
            fontSize: '1.2rem',
            color: 'black',
            marginBottom: '20px',
            fontFamily:"Merriweather",
        }}
        
        >Welcome to E-Pharma, your online pharmacy solution.</p>
        <button
          onClick={handleContinueClick}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            fontFamily:"Merriweather",
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Continue
        </button>
      </div>
      </div>

      <div
        style={{
        //   border: '1px solid #3498db',
          width: '60%',
          height: '100%',
            padding: '30px',
            paddingTop: '70px',

        }}
      >
        <img src={landing_page_img} alt="landing page" style={{ width: '80%', height: 'auto' }} />
      </div>
    </div>
  );
}
