import React from 'react'
import './Hero.css'
import hero_image from '../Assets/hero2.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
        <p>
            New<br/>
            collection<br/>
            <span style={{ whiteSpace: 'nowrap' }}>for everyone</span>
        </p>
        </div>
        <div className="hero-latest-btn">
            <div>Latest Collections</div>
            
        </div>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt=''/>
      </div>
    </div>

  )
}

export default Hero
