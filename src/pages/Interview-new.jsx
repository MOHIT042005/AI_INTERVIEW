// This file is deprecated - use Interview.jsx instead
  useEffect(() => {
    const initializeInterview = async () => {
      try {
        setError(null);
        const data = await createInterview(interviewType);
        setInterviewId(data.id);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user?.id) {
      initializeInterview();
    }
  }, [user?.id, interviewType, createInterview]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = useCallback((answer) => {
    setAnswers([
      ...answers,
      {
        question: currentQuestions[currentQuestion],
        answer: answer,
        timestamp: new Date(),
      },
    ]);

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishInterview();
    }
  }, [currentQuestion, currentQuestions, answers]);

  const handleFinishInterview = useCallback(async () => {
    try {
      if (!interviewId) return;
      
      const duration = Math.round((1800 - timeLeft) / 60); // minutes
      const score = Math.floor(Math.random() * 40) + 60; // Mock score 60-100
      const feedback = aiService.generateFeedback(score);

      await updateInterview(interviewId, score, duration, feedback);

      navigate('/dashboard', {
        state: {
          interviewComplete: true,
          score: score,
          type: interviewType,
        },
      });
    } catch (err) {
      console.error('Error finishing interview:', err);
      setError(err.message);
    }
  }, [interviewId, timeLeft, updateInterview, navigate, interviewType]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error starting interview</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Preparing interview...</p>
      </div>
    );
  }

  if (!currentQuestions[currentQuestion]) {
    return (
      <div className="interview-container">
        <div className="interview-card">
          <h2>Interview Complete!</h2>
          <p>Calculating your results...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="interview-container">
        <div className="interview-header">
          <div className="interview-info">
            <h1>{interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview</h1>
            <p>Question {currentQuestion + 1} of {currentQuestions.length}</p>
          </div>
          <div className="interview-timer">
            <span className="timer">{formatTime(timeLeft)}</span>
            <button
              className="finish-btn"
              onClick={handleFinishInterview}
            >
              Finish Interview
            </button>
          </div>
        </div>

        <div className="interview-card">
          <div className="question-section">
            <h2>{currentQuestions[currentQuestion]}</h2>
          </div>

          <div className="answer-section">
            <div className="answer-input">
              <textarea
                placeholder="Type your answer here..."
                rows="8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAnswer(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <p className="hint">Press Ctrl+Enter to submit answer</p>
            </div>

            <div className="answer-controls">
              <button
                className="record-btn"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? 'Stop Recording' : 'Start Voice Recording'}
              </button>
              <button
                className="next-btn"
                onClick={() => {
                  const textarea = document.querySelector('textarea');
                  handleAnswer(textarea.value);
                  textarea.value = '';
                }}
              >
                {currentQuestion === currentQuestions.length - 1 ? 'Finish Interview' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>

        <div className="interview-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
            ></div>
          </div>
          <p>{Math.round(((currentQuestion + 1) / currentQuestions.length) * 100)}% Complete</p>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Interview;