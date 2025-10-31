import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end space-x-2"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-accent-500 to-accent-600">
        <Bot className="w-4 h-4 text-white" />
      </div>

      <div className="chat-bubble chat-bubble-bot">
        <div className="flex space-x-1">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full wave"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full wave"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full wave"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default TypingIndicator;
