import { motion } from 'framer-motion';
import { MessageSquare, Zap, Lock, Clock } from 'lucide-react';
import axios from 'axios';

function WelcomeScreen({ onStart }) {
  const handleStart = async () => {
    try {
      const response = await axios.post('/api/chat/init');
      onStart(response.data.sessionId);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const features = [
    { icon: Zap, title: 'Instant Responses', desc: 'Get answers in real-time' },
    { icon: Lock, title: 'Secure & Private', desc: 'Your data is protected' },
    { icon: Clock, title: '24/7 Available', desc: 'Always here to help' },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold gradient-text mb-4">
              Welcome to BoldVision
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your intelligent financial customer service assistant
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass rounded-2xl p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="group relative inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transition-all"
          >
            <MessageSquare className="w-6 h-6" />
            <span>Start Conversation</span>
            <motion.div
              className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20"
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-gray-500"
        >
          <p>By starting a conversation, you agree to our terms of service and privacy policy.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default WelcomeScreen;
