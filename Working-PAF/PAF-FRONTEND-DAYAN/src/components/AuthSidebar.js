// src/components/AuthSidebar.js
import React from 'react';
// Import both videos
import loginVideo from '../assets/videos/space-video.mp4'; // Video for login page
import signupVideo from '../assets/videos/space-signup-video.mp4'; // New video for signup page

const AuthSidebar = ({ title, description, isSignup = false }) => {
  // Choose which video to display based on the isSignup prop
  const videoSource = isSignup ? signupVideo : loginVideo;
  
  return (
    <div className="video-background h-full">
      <video autoPlay muted loop>
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay">
        <h2 className="text-3xl md:text-4xl font-nasa text-star-white mb-4 text-center">
          {title}
        </h2>
        <p className="text-lg text-star-white text-center font-light max-w-md">
          {description}
        </p>
        <div className="mt-8">
          <div className="relative">
            <div className="absolute -left-32 -top-24">
              <div className="w-16 h-16 rounded-full bg-space-purple opacity-70 blur-xl"></div>
            </div>
            <div className="absolute -right-20 top-10">
              <div className="w-24 h-24 rounded-full bg-space-blue opacity-50 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;