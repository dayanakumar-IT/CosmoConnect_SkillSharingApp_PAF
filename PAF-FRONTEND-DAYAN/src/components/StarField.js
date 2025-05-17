// src/components/StarField.js
import React, { useEffect, useState } from 'react';

const StarField = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Mouse movement parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Create stars
    const starField = document.querySelector('.star-field');
    const numStars = 200; // More stars for a denser field
    
    // Remove any existing stars first
    while (starField.firstChild) {
      starField.removeChild(starField.firstChild);
    }
    
    // Create new stars with different sizes and brightnesses
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random size with more variation
      const size = `${0.05 + Math.random() * 0.6}rem`;
      star.style.width = size;
      star.style.height = size;
      
      // Random brightness
      const opacity = 0.2 + Math.random() * 0.8;
      star.style.opacity = opacity;
      
      // Random delay for twinkling
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.animationDuration = `${1 + Math.random() * 5}s`;
      
      // Different colors for some stars
      if (Math.random() > 0.9) {
        star.style.backgroundColor = '#FFCC33'; // Yellow
      } else if (Math.random() > 0.95) {
        star.style.backgroundColor = '#FF5555'; // Red
      } else if (Math.random() > 0.97) {
        star.style.backgroundColor = '#5599FF'; // Blue
      }
      
      starField.appendChild(star);
    }
    
    // Create more shooting stars
    for (let i = 0; i < 5; i++) {
      createShootingStar(starField);
    }
    
    // Function to periodically add new shooting stars
    const shootingStarInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        createShootingStar(starField);
      }
    }, 8000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(shootingStarInterval);
    };
  }, []);
  
  // Function to create a shooting star
  const createShootingStar = (container) => {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    // Random position and angle
    shootingStar.style.left = `${Math.random() * 70}%`;
    shootingStar.style.top = `${Math.random() * 40}%`;
    shootingStar.style.transform = `rotate(${Math.random() * 45}deg)`;
    
    // Random length and speed
    const length = 50 + Math.random() * 150;
    shootingStar.style.width = `${length}px`;
    const duration = 1 + Math.random() * 3;
    shootingStar.style.animationDuration = `${duration}s`;
    
    container.appendChild(shootingStar);
    
    // Remove shooting star after animation completes
    setTimeout(() => {
      if (container.contains(shootingStar)) {
        container.removeChild(shootingStar);
      }
    }, duration * 1000);
  };
  
  // Apply subtle parallax effect based on mouse position
  const starFieldStyle = {
    transform: `translate(${mousePosition.x / 100}px, ${mousePosition.y / 100}px)`,
    transition: 'transform 0.5s ease-out'
  };

  return <div className="star-field" style={starFieldStyle}></div>;
};

export default StarField;