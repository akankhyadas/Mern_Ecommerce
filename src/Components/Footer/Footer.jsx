import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo_foot.png'
import insta_icon from '../Assets/insta.png'
import pinterest_icon from '../Assets/pinterest.jpeg'
import whatsapp_icon from '../Assets/whatsapp.jpeg'


const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt=''/>
        <p>VELENZO</p>
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <img src={insta_icon} alt=""/>
        </div>
        <div className="footer-icons-container">
          <img src={pinterest_icon} alt=""/>
        </div>
        <div className="footer-icons-container">
          <img src={whatsapp_icon} alt=""/>
        </div>
      </div>
      <div className="footer-copyright">
        <hr/>
        <p>Copyright @2024 - All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
