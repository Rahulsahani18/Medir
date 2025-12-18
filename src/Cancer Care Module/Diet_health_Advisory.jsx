import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Heart,
  Calendar,
  Salad,
  HeartPulse,
  Clock,
  Loader2,
  RefreshCw,
  Play,
  BookOpen,
  Quote,
} from "lucide-react";
import "./DietAndHealth.css";
import {
  fetchDietPlans,
  fetchHealthAdvisories,
  refreshDietData,
  refreshHealthData,
} from "../Redux/dietHealthSlice";

const DietAndHealth = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("diet");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  // Get data from Redux store
  const {
    dietPlans,
    healthAdvisories,
    dietLoading,
    healthLoading,
    dietError,
    healthError,
    lastDietFetch,
    lastHealthFetch,
  } = useSelector((state) => state.dietHealth);

  // Function to handle diet refresh
  const handleRefreshDiet = () => {
    dispatch(refreshDietData());
    dispatch(fetchDietPlans())
      .unwrap()
      .then(() => {
        toast.success("Diet plans refreshed successfully!");
      })
      .catch((error) => {
        toast.error(error || "Failed to refresh diet plans");
      });
  };

  // Function to handle health refresh
  const handleRefreshHealth = () => {
    dispatch(refreshHealthData());
    dispatch(fetchHealthAdvisories())
      .unwrap()
      .then(() => {
        toast.success("Health advisories refreshed successfully!");
      })
      .catch((error) => {
        toast.error(error || "Failed to refresh health advisories");
      });
  };

  // Fetch diet data on component mount if not already fetched
  useEffect(() => {
    if (!lastDietFetch && !dietLoading) {
      dispatch(fetchDietPlans())
        .unwrap()
        .catch((error) => {
          toast.error(error || "Failed to load diet plans");
        });
    }
  }, [dispatch, lastDietFetch, dietLoading]);

  // Fetch health data when tab switches to health
  useEffect(() => {
    if (activeTab === "health" && !lastHealthFetch && !healthLoading) {
      dispatch(fetchHealthAdvisories())
        .unwrap()
        .catch((error) => {
          toast.error(error || "Failed to load health advisories");
        });
    }
  }, [activeTab, dispatch, lastHealthFetch, healthLoading]);

  // Show error toasts when errors occur
  useEffect(() => {
    if (dietError) {
      toast.error(dietError);
    }
  }, [dietError]);

  useEffect(() => {
    if (healthError) {
      toast.error(healthError);
    }
  }, [healthError]);

  const handleViewContent = (title, description) => {
    setModalContent({ title, description });
    setShowModal(true);
  };

  // Map content type to icons
  // const getHealthIcon = (title) => {
  //   const titleLower = title.toLowerCase();

  //   if (titleLower.includes("stress") || titleLower.includes("anxiety")) {
  //     return HeartPulse;
  //   } else if (titleLower.includes("nutrient") || titleLower.includes("diet")) {
  //     return Salad;
  //   } else if (titleLower.includes("motivation") || titleLower.includes("quote")) {
  //     return Quote;
  //   } else if (titleLower.includes("video")) {
  //     return Play;
  //   } else {
  //     return BookOpen;
  //   }
  // };

  // Map content type to display type
  const getContentType = (title) => {
    const titleLower = title.toLowerCase();

    if (titleLower.includes("stress") || titleLower.includes("anxiety")) {
      return "Article";
    } else if (titleLower.includes("nutrient") || titleLower.includes("diet")) {
      return "Article";
    } else if (
      titleLower.includes("motivation") ||
      titleLower.includes("quote")
    ) {
      return "Quote";
    } else {
      return "Article";
    }
  };

  // Map content type to duration
  const getContentDuration = (title) => {
    const titleLower = title.toLowerCase();

    if (titleLower.includes("stress") || titleLower.includes("anxiety")) {
      return "5 min read";
    } else if (titleLower.includes("nutrient") || titleLower.includes("diet")) {
      return "7 min read";
    } else if (
      titleLower.includes("motivation") ||
      titleLower.includes("quote")
    ) {
      return "Updated daily";
    } else {
      return "5 min read";
    }
  };

  const renderDietCards = () => {
    if (dietLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading diet plans...</p>
        </div>
      );
    }

    if (dietError) {
      return (
        <div className="DietAndHealth__error">
          <p>Failed to load diet plans. Please try again.</p>
          <button
            className="DietAndHealth__retry-btn"
            onClick={handleRefreshDiet}
          >
            Retry
          </button>
        </div>
      );
    }

    if (!dietPlans || dietPlans.length === 0) {
      return (
        <div className="DietAndHealth__empty">
          <p>No diet plans available at the moment.</p>
          <button
            className="DietAndHealth__retry-btn"
            onClick={handleRefreshDiet}
          >
            Refresh
          </button>
        </div>
      );
    }

    return (
      <div className="DietAndHealth__cards-grid">
        {dietPlans.map((diet, index) => (
          <div
            key={diet.id || diet._id || index}
            className="DietAndHealth__card"
          >
            <div className="DietAndHealth__card-header">
              <div>
                <h3 className="DietAndHealth__card-title">
                  {diet.title || "Untitled Diet"}
                </h3>
                <p className="DietAndHealth__card-subtitle">
                  {diet.sub_title || "Daily nutrition"}
                </p>
              </div>
              <div className="DietAndHealth__card-icon-wrapper">
                <Salad className="DietAndHealth__card-icon" size={28} />
              </div>
            </div>
            <div className="DietAndHealth__card-time">
              <Clock size={15} /> {diet.hour || "Time not specified"}
            </div>
            <button
              className="DietAndHealth__view-btn"
              onClick={() =>
                handleViewContent(
                  diet.title || "Diet Plan",
                  diet.content || "No description available."
                )
              }
            >
              View Content
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderHealthCards = () => {
    if (healthLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading health advisories...</p>
        </div>
      );
    }

    if (healthError) {
      return (
        <div className="DietAndHealth__error">
          <p>Failed to load health advisories. Please try again.</p>
          <button
            className="DietAndHealth__retry-btn"
            onClick={handleRefreshHealth}
          >
            Retry
          </button>
        </div>
      );
    }

    if (!healthAdvisories || healthAdvisories.length === 0) {
      return (
        <div className="DietAndHealth__empty">
          <p>No health advisories available at the moment.</p>
          <button
            className="DietAndHealth__retry-btn"
            onClick={handleRefreshHealth}
          >
            Refresh
          </button>
        </div>
      );
    }

    return (
      <div className="DietAndHealth__cards-grid">
        {healthAdvisories.map((item) => {
          // const HealthIcon = getHealthIcon(item.title);
          const contentType = getContentType(item.title);
          const contentDuration = getContentDuration(item.title);

          return (
            <div key={item.id} className="DietAndHealth__card">
              <div className="DietAndHealth__card-header">
                <div>
                  <h3 className="DietAndHealth__card-title">{item.title}</h3>
                </div>
                {/* <div className="DietAndHealth__card-icon-wrapper">
                  <HealthIcon
                    className="DietAndHealth__card-icon"
                    size={28}
                  />
                </div> */}
              </div>
              <div className="DietAndHealth__card-meta">
                {contentType} • {contentDuration}
              </div>
              <button
                className="DietAndHealth__view-btn"
                onClick={() => handleViewContent(item.title, item.content)}
              >
                View Content
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .DietAndHealth__loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .DietAndHealth__spinner {
          animation: spin 1s linear infinite;
          color: #4CAF50;
        }

        .DietAndHealth__loading p {
          color: #666;
          font-size: 16px;
        }

        .DietAndHealth__error {
          text-align: center;
          padding: 40px 20px;
          color: #d32f2f;
        }

        .DietAndHealth__retry-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 16px;
          transition: background-color 0.3s;
        }

        .DietAndHealth__retry-btn:hover {
          background-color: #45a049;
        }

        .DietAndHealth__empty {
          text-align: center;
          padding: 40px 20px;
          color: #666;
          font-size: 16px;
        }

        .DietAndHealth__section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .DietAndHealth__refresh-btn {
          background-color: transparent;
          border: 1px solid #4CAF50;
          color: #4CAF50;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          font-size: 14px;
        }

        .DietAndHealth__refresh-btn:hover {
          background-color: #4CAF50;
          color: white;
        }

        .DietAndHealth__refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .DietAndHealth__refresh-btn.loading {
          background-color: #f0f0f0;
          border-color: #ddd;
          color: #666;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="DietAndHealth__container">
        <div className="DietAndHealth__header">
          <div className="DietAndHealth__header-content">
            <h1 className="DietAndHealth__header-title">
              Cancer Care Diet & Health Advisory
            </h1>
            <p className="DietAndHealth__header-subtitle">
              Eat right, stay strong, heal better.
            </p>
          </div>
          <div className="DietAndHealth__header-icon">
            <Heart size={48} />
          </div>
        </div>

        <div className="DietAndHealth__tabs">
          <button
            className={`DietAndHealth__tab ${
              activeTab === "diet" ? "DietAndHealth__tab--active" : ""
            }`}
            onClick={() => setActiveTab("diet")}
          >
            <Salad size={20} /> Diet
          </button>
          <button
            className={`DietAndHealth__tab ${
              activeTab === "health" ? "DietAndHealth__tab--active" : ""
            }`}
            onClick={() => setActiveTab("health")}
          >
            <HeartPulse size={20} /> Health Advisory
          </button>
        </div>

        <div className="DietAndHealth__content">
          {activeTab === "diet" && (
            <>
              <div className="DietAndHealth__section-header">
                <h2 className="DietAndHealth__section-title">
                  <Calendar size={25} />
                  Daily Diet Plan
                </h2>
                <button
                  className={`DietAndHealth__refresh-btn ${
                    dietLoading ? "loading" : ""
                  }`}
                  onClick={handleRefreshDiet}
                  disabled={dietLoading}
                >
                  <RefreshCw
                    size={16}
                    className={dietLoading ? "DietAndHealth__spinner" : ""}
                  />
                  {dietLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              {renderDietCards()}
            </>
          )}

          {activeTab === "health" && (
            <>
              <div className="DietAndHealth__section-header">
                <h2 className="DietAndHealth__section-title">
                  <Heart size={25} /> Health Advisory & Wellness Tips
                </h2>
                <button
                  className={`DietAndHealth__refresh-btn ${
                    healthLoading ? "loading" : ""
                  }`}
                  onClick={handleRefreshHealth}
                  disabled={healthLoading}
                >
                  <RefreshCw
                    size={16}
                    className={healthLoading ? "DietAndHealth__spinner" : ""}
                  />
                  {healthLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              {renderHealthCards()}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="DietAndHealth__modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="DietAndHealth__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="DietAndHealth__modal-header">
              <h3 className="DietAndHealth__modal-title">
                {modalContent.title}
              </h3>
              <button
                className="DietAndHealth__modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="DietAndHealth__modal-body">
              <p className="DietAndHealth__modal-description">
                {modalContent.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DietAndHealth;
