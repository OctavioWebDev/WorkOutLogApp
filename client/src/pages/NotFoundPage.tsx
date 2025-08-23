import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: ['💪', '🏃‍♂️', '🏋️‍♀️', '🎯', '⚡', '🔥', '💯', '🚀'][i % 8],
    delay: i * 0.5,
    duration: 3 + (i % 3),
    size: 20 + (i % 3) * 10
  }));

  const quickActions = [
    {
      title: 'Dashboard',
      description: 'View your fitness overview',
      icon: '📊',
      path: '/dashboard',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Goals',
      description: 'Manage your fitness goals',
      icon: '🎯',
      path: '/goals',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Analytics',
      description: 'Track your progress',
      icon: '📈',
      path: '/analytics',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Profile',
      description: 'Update your settings',
      icon: '👤',
      path: '/profile',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute animate-bounce opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
              fontSize: `${element.size}px`
            }}
          >
            {element.emoji}
          </div>
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>

      {/* Mouse Follower */}
      <div
        className="fixed w-6 h-6 bg-white rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: isHovering ? 'scale(2)' : 'scale(1)'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* 404 Text with Glitch Effect */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse select-none">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-red-500 opacity-20 animate-ping">
            404
          </div>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-blue-500 opacity-10 animate-bounce">
            404
          </div>
        </div>

        {/* Main Message */}
        <div className="max-w-2xl mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Oops! This page is taking a rest day
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Looks like this page skipped leg day and disappeared! Don't worry though - 
            your fitness journey continues. Let's get you back on track.
          </p>
          
          {/* Animated Fitness Quote */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
            <p className="text-lg text-blue-200 italic">
              "The only bad workout is the one that didn't happen... 
              <br />
              <span className="text-purple-300">just like this page!"</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          <button
            onClick={() => navigate(-1)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl group-hover:animate-bounce">⬅️</span>
              Go Back
            </span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="group px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-full hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/50"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl group-hover:animate-spin">🏠</span>
              Home Dashboard
            </span>
          </button>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
          {quickActions.map((action, index) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className={`group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="text-4xl mb-3 group-hover:animate-bounce">
                {action.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                {action.title}
              </h3>
              <p className="text-gray-300 text-sm">
                {action.description}
              </p>
            </button>
          ))}
        </div>

        {/* Fun Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2 animate-pulse">
              404
            </div>
            <div className="text-gray-300 text-sm">
              Calories you didn't burn finding this page
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2 animate-pulse animation-delay-1000">
              0
            </div>
            <div className="text-gray-300 text-sm">
              Workouts missed while here
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2 animate-pulse animation-delay-2000">
              ∞
            </div>
            <div className="text-gray-300 text-sm">
              Possibilities ahead
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            Lost? No worries! Even the best athletes take wrong turns sometimes.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-2xl animate-bounce">💪</span>
            <span className="text-gray-300">Keep pushing forward!</span>
            <span className="text-2xl animate-bounce animation-delay-500">🚀</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style>
        {`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        `}
      </style>
    </div>
  );
};

export default NotFoundPage;