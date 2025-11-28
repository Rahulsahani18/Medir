import { useState, useEffect, useRef } from "react";
import "./Home.css";


const NewTestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const sliderRef = useRef(null);
  const sliderTrackRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      rating: 5,
      title: "Excellent Service",
      text: "I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.",
      name: "Sofia Doe",
      country: "United States",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      rating: 5,
      title: "Nice Treatment",
      text: "I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.",
      name: "Deny Hendrawan",
      country: "United States",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      rating: 5,
      title: "Good Hospitability",
      text: "Genuinely cares about his patients. He helped me understand my condition and worked with me to create a plan.",
      name: "Johnson DWayne",
      country: "United States",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      rating: 5,
      title: "Professional Care",
      text: "The entire team was amazing. From booking to consultation, everything was smooth and professional.",
      name: "Emily Davis",
      country: "United States",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      rating: 5,
      title: "Highly Recommended",
      text: "Outstanding care and attention to detail. The doctor took time to answer all my questions thoroughly.",
      name: "Michael Brown",
      country: "United States",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
      id: 6,
      rating: 5,
      title: "Amazing Experience",
      text: "Very impressed with the level of care and professionalism. The facilities are top-notch.",
      name: "Sarah Johnson",
      country: "United States",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
  ];

  const stats = [
    { value: "1,00,000+", label: "Happy Patients" },
    { value: "13+", label: "Medical Collegess" },
    { value: "1,000+", label: "Qualified & Experienced Doctors" },
    { value: "1,00,000+", label: "Video and offline Appointments" },
    { value: "317+", label: "Lab Tests Available" },
  ];


  // Create infinite loop by duplicating testimonials
  const extendedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(testimonials.length + index);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  // Touch and mouse event handlers
  const touchStart = (e) => {
    setIsDragging(true);
    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    setStartX(clientX);
    setPrevTranslate(currentTranslate);
    setIsTransitioning(false);
  };

  const touchMove = (e) => {
    if (!isDragging) return;

    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    const currentX = clientX - startX;
    setCurrentTranslate(prevTranslate + currentX);
  };

  const touchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;

    // If drag was significant enough, change slide
    if (Math.abs(movedBy) > 50) {
      if (movedBy > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }

    // Reset translate position
    setCurrentTranslate(0);
    setPrevTranslate(0);
  };

  // Reset position for infinite loop
  useEffect(() => {
    if (currentIndex >= testimonials.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(testimonials.length);
      }, 600);
    } else if (currentIndex <= 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(testimonials.length);
      }, 600);
    }
  }, [currentIndex, testimonials.length]);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning && !isDragging) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isTransitioning, isDragging]);

  // Calculate active dot
  const getActiveDot = () => {
    let index = currentIndex % testimonials.length;
    if (index < 0) index = testimonials.length + index;
    return index;
  };

  // Calculate transform style
  const getTransformStyle = () => {
    if (isDragging) {
      return `translateX(calc(-${currentIndex * (100 / 3)}% - ${
        currentIndex * 24
      }px + ${currentTranslate}px))`;
    }
    return `translateX(calc(-${currentIndex * (100 / 3)}% - ${
      currentIndex * 24
    }px))`;
  };

  return (
    <>
      <div className="newtstmnl-wrapper">
        <div className="container">
          <div className="section-header">
            <div className="featured-badge">✦ Testimonials ✦</div>
            <h2 className="section-title">15k Users Trust Doccure Worldwide</h2>
          </div>

          <div
            className="newtstmnl-slider-container"
            ref={sliderRef}
            onMouseDown={touchStart}
            onMouseMove={touchMove}
            onMouseUp={touchEnd}
            onMouseLeave={touchEnd}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
          >
            <div
              className={`newtstmnl-slider-track ${
                !isTransitioning ? "no-transition" : ""
              } ${isDragging ? "dragging" : ""}`}
              ref={sliderTrackRef}
              style={{
                transform: getTransformStyle(),
              }}
            >
              {extendedTestimonials.map((testimonial, idx) => (
                <div
                  key={`${testimonial.id}-${idx}`}
                  className="newtstmnl-card-wrapper"
                >
                  <div className="newtstmnl-card">
                    <div style={{ position: "relative" }}>
                      <div className="newtstmnl-stars">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="newtstmnl-star">
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="newtstmnl-quote-icon">"</div>
                    </div>
                    <h3 className="newtstmnl-card-title">
                      {testimonial.title}
                    </h3>
                    <p className="newtstmnl-card-text">{testimonial.text}</p>
                    <div className="newtstmnl-author">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="newtstmnl-avatar"
                      />
                      <div className="newtstmnl-author-info">
                        <h4>{testimonial.name}</h4>
                        <p>{testimonial.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="newtstmnl-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`newtstmnl-dot ${
                  getActiveDot() === index ? "newtstmnl-active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="tstmnls-stats container">
            {stats.map((stat, index) => (
              <div key={index} className="tstmnls-stat-item">
                <div className="tstmnls-stat-value">{stat.value}</div>
                <div className="tstmnls-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </>
  );
};

export default NewTestimonialSlider;
