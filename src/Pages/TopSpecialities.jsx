import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaHeart, FaBrain, FaBaby, FaUserMd, FaClinicMedical, FaPills, FaFlask, FaHome, FaHospital, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GiLungs, GiKidneys, GiBoneKnife } from 'react-icons/gi';
import { MdPsychology } from 'react-icons/md';
import './Home.css';
import DotBanner from '../assets/reason-bg.svg'

const TopSpecialities = () => {

  const trackRef1 = useRef(null);

  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const specialtiesRow1 = [
    { id: 1, name: 'Pulmonology', doctors: 41, icon: <GiLungs size={32} />, image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=300&h=300&fit=crop' },
    { id: 2, name: 'Urology', doctors: 39, icon: <GiKidneys size={32} />, image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop' },
    { id: 3, name: 'Neurology', doctors: 176, icon: <FaBrain size={32} />, image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=300&h=300&fit=crop' },
    { id: 4, name: 'Cardiology', doctors: 254, icon: <FaHeart size={32} />, image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=300&h=300&fit=crop' },
    { id: 5, name: 'Orthopedics', doctors: 151, icon: <GiBoneKnife size={32} />, image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=300&h=300&fit=crop' },
    { id: 6, name: 'Pediatrics', doctors: 124, icon: <FaBaby size={32} />, image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=300&h=300&fit=crop' },
    { id: 7, name: 'Psychiatry', doctors: 112, icon: <MdPsychology size={32} />, image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop' },
    { id: 8, name: 'Dermatology', doctors: 98, icon: <FaClinicMedical size={32} />, image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=300&h=300&fit=crop' },
  ];



  // Calculate card width including gap
  const CARD_WIDTH = 230; // 200px card + 30px gap

  const handleSpecialtyClick = (specialty) => {
    console.log('Clicked:', specialty.name);
    alert(`You clicked on ${specialty.name} with ${specialty.doctors} doctors`);
  };

  // Smooth scroll using requestAnimationFrame for linear movement
  const smoothScrollTo = useCallback((targetPosition, duration = 500) => {
    const track = trackRef1.current;
    if (!track) return;

    const startPosition = track.scrollLeft;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Linear easing
      const easeProgress = progress;
      
      track.scrollLeft = startPosition + (distance * easeProgress);
      
      if (timeElapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, []);

  const scrollLeft = useCallback(() => {
    const track = trackRef1.current;
    if (!track) return;

    const currentScroll = track.scrollLeft;
    const targetScroll = currentScroll - CARD_WIDTH;

    // If we're at the beginning, jump to the end (seamless loop)
    if (targetScroll <= 0) {
      // First scroll to the position that looks like the previous card
      smoothScrollTo(targetScroll, 300);
      // Then instantly jump to the equivalent position in the last segment
      setTimeout(() => {
        track.scrollLeft = track.scrollWidth / 3 + targetScroll;
      }, 300);
    } else {
      smoothScrollTo(targetScroll, 300);
    }
  }, [smoothScrollTo]);

  const scrollRight = useCallback(() => {
    const track = trackRef1.current;
    if (!track) return;

    const currentScroll = track.scrollLeft;
    const targetScroll = currentScroll + CARD_WIDTH;
    const maxScroll = track.scrollWidth - track.clientWidth;

    // If we're at the end, jump to the beginning (seamless loop)
    if (targetScroll >= maxScroll) {
      // First scroll to the position that looks like the next card
      smoothScrollTo(targetScroll, 300);
      // Then instantly jump to the equivalent position in the first segment
      setTimeout(() => {
        track.scrollLeft = targetScroll - (track.scrollWidth / 3 * 2);
      }, 300);
    } else {
      smoothScrollTo(targetScroll, 300);
    }
  }, [smoothScrollTo]);

  // Auto-scroll functionality with requestAnimationFrame for smoothness
  useEffect(() => {
    const track = trackRef1.current;
    if (!track) return;

    let lastTime = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const autoScroll = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      
      if (!isPaused && track) {
        scrollPositionRef.current += scrollSpeed * (deltaTime / 16);
        
        const maxScroll = track.scrollWidth - track.clientWidth;
        
        // Reset position when reaching the end (seamless loop)
        if (scrollPositionRef.current >= maxScroll) {
          scrollPositionRef.current = 0;
        }
        
        track.scrollLeft = scrollPositionRef.current;
      }
      
      lastTime = currentTime;
      autoScrollRef.current = requestAnimationFrame(autoScroll);
    };

    autoScrollRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused]);

  // Initialize scroll position
  useEffect(() => {
    const track = trackRef1.current;
    if (track) {
      // Start from the beginning of the first segment
      scrollPositionRef.current = 0;
      track.scrollLeft = 0;
    }
  }, []);

  return (
    <>
    <div className="topSpecialities__container">
      {/* Top Specialties Section */}
      <div className="topSpecialities__section">
        <div className="section-header">
          <div className="featured-badge">✦ Top Specialities ✦</div>
          <h2 className="section-title">Highlighting the Care & Support</h2>
        </div>

        
        <div 
          className="topSpecialities__sliderContainer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={trackRef1}
            className="topSpecialities__track"
          >
            {[...specialtiesRow1, ...specialtiesRow1, ...specialtiesRow1].map((specialty, index) => (
              <div
                key={`${specialty.id}-${index}`}
                className="topSpecialities__card"
                onClick={() => handleSpecialtyClick(specialty)}
              >
                <div className="topSpecialities__imageWrapper">
                  <img 
                    src={specialty.image} 
                    alt={specialty.name}
                    className="topSpecialities__image"
                  />
                  <div className="topSpecialities__iconOverlay">
                    {specialty.icon}
                  </div>
                </div>
                <h3 className="topSpecialities__cardTitle">{specialty.name}</h3>
                <p className="topSpecialities__cardSubtitle">{specialty.doctors} Doctors</p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons - Center Bottom */}
          <div className="topSpecialities__navigation">
            <button 
              className="topSpecialities__navButton topSpecialities__navButton--left"
              onClick={scrollLeft}
            >
              <FaChevronLeft />
            </button>
            <button 
              className="topSpecialities__navButton topSpecialities__navButton--right"
              onClick={scrollRight}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>


    </div>
    <div className='conatiner-fluid overflow-hidden'>
    <img src={DotBanner} />
    </div>
    </>
  );
};

// CSS Styles

export default TopSpecialities;