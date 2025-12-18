import React, { useState } from 'react';
import './SupportGroups.css'
import { Users, Send, MessageCircle, Stethoscope, User, Heart, ThumbsUp, Clock } from 'lucide-react';

const SupportGroups = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'doctor',
      avatar: '👨‍⚕️',
      message: 'Remember, every journey is unique. Stay positive and dont hesitate to reach out to your care team with any concerns. Youre doing great!',
      time: '2 hours ago',
      likes: 24
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'patient',
      avatar: '👤',
      message: 'Today marks my 6th week of treatment. Feeling much stronger than before. Thank you everyone for the constant support and encouragement!',
      time: '4 hours ago',
      likes: 18
    },
    {
      id: 3,
      name: 'Dr. Robert Miller',
      role: 'doctor',
      avatar: '👨‍⚕️',
      message: 'Nutrition tip: Try to include protein-rich foods in every meal. It helps maintain strength during treatment. Greek yogurt, eggs, and lean meats are excellent choices.',
      time: '6 hours ago',
      likes: 32
    },
    {
      id: 4,
      name: 'Emma Rodriguez',
      role: 'patient',
      avatar: '👤',
      message: 'Started meditation and breathing exercises this week. Its really helping with anxiety. Highly recommend the Calm app!',
      time: '8 hours ago',
      likes: 15
    },
    {
      id: 5,
      name: 'David Thompson',
      role: 'patient',
      avatar: '👤',
      message: 'To anyone starting treatment soon - you are stronger than you think. This community has been my lifeline. Dont be afraid to ask questions or share your feelings.',
      time: '1 day ago',
      likes: 41
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [userRole, setUserRole] = useState('patient');
  const [userName, setUserName] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleAddComment = (e) => {
    if (newComment.trim() && userName.trim()) {
      const comment = {
        id: comments.length + 1,
        name: userName,
        role: userRole,
        avatar: userRole === 'doctor' ? '👨‍⚕️' : '👤',
        message: newComment,
        time: 'Just now',
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setShowCommentForm(false);
    }
  };

  const handleLike = (id) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
    ));
  };

  return (
    <>

      <div className="SupportGroups__container">
        <div className="SupportGroups__header">
          <div className="SupportGroups__header-content">
            <h1 className="SupportGroups__header-title">
              <Users size={32} />
              Support Groups
            </h1>
            <p className="SupportGroups__header-subtitle">
              Connect, share experiences, and support each other through your journey
            </p>
          </div>
          <div className="SupportGroups__header-icon">
            {/* <Heart size={48} /> */}
          </div>
        </div>

        
        {!showCommentForm && (
          <button 
            className="SupportGroups__add-comment-btn"
            onClick={() => setShowCommentForm(true)}
          >
            <MessageCircle size={20} />
            Share Your Thoughts
          </button>
        )}

        {showCommentForm && (
          <div className="SupportGroups__comment-form">
            <div className="SupportGroups__form-header">
              <MessageCircle size={24} color="#667eea" />
              <h3 className="SupportGroups__form-title">Share Your Experience</h3>
            </div>

            <div>
              <div className="SupportGroups__form-group">
                <label className="SupportGroups__form-label">Your Name</label>
                <input
                  type="text"
                  className="SupportGroups__form-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              {/* <div className="SupportGroups__form-group">
                <label className="SupportGroups__form-label">I am a</label>
                <div className="SupportGroups__role-selector">
                  <div 
                    className={`SupportGroups__role-option ${userRole === 'patient' ? 'SupportGroups__role-option--active' : ''}`}
                    onClick={() => setUserRole('patient')}
                  >
                    <User size={18} />
                    Patient
                  </div>
                  <div 
                    className={`SupportGroups__role-option ${userRole === 'doctor' ? 'SupportGroups__role-option--active' : ''}`}
                    onClick={() => setUserRole('doctor')}
                  >
                    <Stethoscope size={18} />
                    Healthcare Provider
                  </div>
                </div>
              </div> */}

              <div className="SupportGroups__form-group">
                <label className="SupportGroups__form-label">Your Message</label>
                <textarea
                  className="SupportGroups__form-textarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts, experiences, or ask a question..."
                />
              </div>

              <div className="SupportGroups__form-actions">
                <button 
                  className="SupportGroups__btn SupportGroups__btn-secondary"
                  onClick={() => {
                    setShowCommentForm(false);
                    setNewComment('');
                    setUserName('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="SupportGroups__btn SupportGroups__btn-primary"
                  onClick={handleAddComment}
                >
                  <Send size={18} style={{ marginRight: '8px' }} />
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="SupportGroups__comments-section">
          <div className="SupportGroups__section-header">
            <MessageCircle size={24} color="#667eea" />
            <h2 className="SupportGroups__section-title">Community Posts</h2>
          </div>

          <div className="SupportGroups__comments-list">
            {comments.map(comment => (
              <div 
                key={comment.id} 
                className={`SupportGroups__comment ${comment.role === 'doctor' ? 'SupportGroups__comment--doctor' : ''}`}
              >
                <div className="SupportGroups__comment-header">
                  <div className="SupportGroups__comment-avatar">
                    {comment.avatar}
                  </div>
                  <div className="SupportGroups__comment-info">
                    <p className="SupportGroups__comment-name">
                      {comment.name}
                      <span className={`SupportGroups__comment-role ${comment.role === 'patient' ? 'SupportGroups__comment-role--patient' : ''}`}>
                        {comment.role === 'doctor' ? (
                          <>
                            <Stethoscope size={12} />
                            Healthcare Provider
                          </>
                        ) : (
                          <>
                            <User size={12} />
                            Patient
                          </>
                        )}
                      </span>
                    </p>
                    <p className="SupportGroups__comment-time">
                      <Clock size={14} />
                      {comment.time}
                    </p>
                  </div>
                </div>

                <p className="SupportGroups__comment-message">{comment.message}</p>

                <div className="SupportGroups__comment-actions">
                  <button 
                    className="SupportGroups__like-btn"
                    onClick={() => handleLike(comment.id)}
                  >
                    <ThumbsUp size={16} className="SupportGroups__like-icon" />
                    {comment.likes} {comment.likes === 1 ? 'Like' : 'Likes'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportGroups;