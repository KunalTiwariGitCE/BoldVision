import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Volume2, VolumeX, User } from 'lucide-react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import TranscriptPanel from './TranscriptPanel';

function ChatInterface({ sessionId, contactInfo, onContactUpdate, onShowContactModal }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showTranscript, setShowTranscript] = useState(true);
  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    // Load initial greeting
    loadInitialMessage();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadInitialMessage = async () => {
    try {
      const response = await axios.post('/api/chat/init');
      const greeting = {
        role: 'assistant',
        content: response.data.introduction,
        timestamp: new Date(),
      };
      setMessages([greeting]);
      if (voiceEnabled) {
        speak(greeting.content);
      }
    } catch (error) {
      console.error('Failed to load initial message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speak = (text) => {
    if (!voiceEnabled || !synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice for more natural sound
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.lang.includes('en-US') && voice.name.includes('Female')
    ) || voices.find((voice) => voice.lang.includes('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chat/message', {
        sessionId,
        message: inputValue,
      });

      const botMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (voiceEnabled) {
        speak(response.data.response);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full p-4 gap-4">
      {/* Main Chat Area */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col glass rounded-3xl overflow-hidden"
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-500" />
              </div>
              {isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-white rounded-full opacity-50"
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold">BoldVision Assistant</h3>
              <p className="text-xs opacity-90">
                {isSpeaking ? 'Speaking...' : 'Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                }
                setVoiceEnabled(!voiceEnabled);
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {voiceEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/50 to-white/30">
          <AnimatePresence>
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-shadow"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Transcript Panel */}
      {showTranscript && (
        <TranscriptPanel
          messages={messages}
          onClose={() => setShowTranscript(false)}
        />
      )}
    </div>
  );
}

export default ChatInterface;
