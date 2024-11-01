import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Calendar, Clock, Quote, Award, Bookmark, Moon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const quotes = [
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Everything you've ever wanted is on the other side of fear.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Your mind is a garden, your thoughts are the seeds.",
  "Every moment is a fresh beginning.",
];

const affirmations = [
  "I am capable of achieving anything I set my mind to.",
  "I choose to be confident and self-assured.",
  "I am surrounded by love and positive energy.",
  "I trust in my abilities and inner wisdom.",
  "I am grateful for all the abundance in my life.",
  "I radiate peace, love, and harmony.",
];

const breathingInstructions = [
  "Breathe in slowly...",
  "Hold...",
  "Breathe out gently...",
  "Rest..."
];

const MindfulnessApp = () => {
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [isHeartAnimated, setIsHeartAnimated] = useState(false);
  const [breathingTime, setBreathingTime] = useState(60);
  const [isBreathing, setIsBreathing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState('light');
  const [streak, setStreak] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [totalBreathingCycles, setTotalBreathingCycles] = useState(0);

  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setCurrentAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
  }, []);

  const handleHeartClick = () => {
    setIsHeartAnimated(true);
    setStreak(prev => prev + 1);
    setShowAlert(true);
    setTimeout(() => {
      setIsHeartAnimated(false);
      setShowAlert(false);
    }, 1000);
  };

  const startBreathing = useCallback((seconds) => {
    setBreathingTime(seconds);
    setTimeRemaining(seconds);
    setIsBreathing(true);
    setProgress(0);
    setBreathingPhase(0);
    setShowCompletionMessage(false);
    setTotalBreathingCycles(Math.floor(seconds / 16)); // Each cycle is 16 seconds (4+4+4+4)
  }, []);

  useEffect(() => {
    let timer;
    let progressTimer;
    let phaseTimer;

    if (isBreathing && timeRemaining > 0) {
      // Main timer for countdown
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      // Progress bar timer
      progressTimer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (breathingTime * 10));
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 100);

      // Breathing phase timer (4 seconds per phase)
      phaseTimer = setInterval(() => {
        setBreathingPhase(prev => (prev + 1) % 4);
      }, 4000);
    }

    if (timeRemaining === 0 && isBreathing) {
      setIsBreathing(false);
      setShowCompletionMessage(true);
      setProgress(100);
    }

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
      clearInterval(phaseTimer);
    };
  }, [isBreathing, timeRemaining, breathingTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getBreathingMessage = () => {
    if (showCompletionMessage) {
      return (
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-green-500">Session Complete! 🎉</p>
          <p className="text-lg">You completed {totalBreathingCycles} breathing cycles.</p>
          <p>Take a moment to notice how calm you feel.</p>
        </div>
      );
    }
    return breathingInstructions[breathingPhase];
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <span className="text-lg">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Moon className="w-6 h-6" />
          </button>
        </div>

        {/* Affirmation Section */}
        <div className={`p-6 rounded-lg mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className="text-2xl font-bold mb-4 text-center">Daily Affirmation</h2>
          <p className="text-lg text-center mb-6">{currentAffirmation}</p>
          <div className="flex justify-center">
            <button
              onClick={handleHeartClick}
              className="transition-transform"
            >
              <Heart
                className={`w-12 h-12 text-red-500 ${isHeartAnimated ? 'scale-125' : ''} transition-transform`}
                fill={isHeartAnimated ? 'currentColor' : 'none'}
              />
            </button>
          </div>
          {showAlert && (
            <Alert className="mt-4 bg-green-100 border-green-400">
              <AlertDescription>
                Great job! You've maintained a {streak} day streak! 🎉
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Breathing Exercise Section */}
        <div className={`p-6 rounded-lg mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className="text-2xl font-bold mb-4 text-center">Mindful Breathing</h2>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => startBreathing(60)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              disabled={isBreathing}
            >
              1 Minute
            </button>
            <button
              onClick={() => startBreathing(180)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              disabled={isBreathing}
            >
              3 Minutes
            </button>
            <button
              onClick={() => startBreathing(300)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              disabled={isBreathing}
            >
              5 Minutes
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div 
              className={`w-32 h-32 rounded-full border-4 border-blue-500 mb-4 transition-all duration-1000 ease-in-out ${
                isBreathing ? 'scale-110' : ''
              } ${breathingPhase === 0 ? 'scale-125' : breathingPhase === 1 ? 'scale-125' : breathingPhase === 2 ? 'scale-100' : 'scale-100'}`} 
            />
            <div className="text-3xl font-bold mb-4">
              {formatTime(timeRemaining)}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-6 text-center">
              <p className="text-xl font-medium animate-fade-in">
                {getBreathingMessage()}
              </p>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center gap-2 mb-4">
            <Quote className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Quote of the Day</h2>
          </div>
          <p className="text-lg italic">{currentQuote}</p>
        </div>

        {/* Achievement Section */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Award className="w-6 h-6 text-yellow-500" />
          <span className="text-lg">Current Streak: {streak} days</span>
          <Bookmark className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default MindfulnessApp;