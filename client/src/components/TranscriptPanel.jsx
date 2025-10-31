import { motion } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';

function TranscriptPanel({ messages, onClose }) {
  const downloadTranscript = () => {
    const transcript = messages
      .map((msg) => {
        const timestamp = new Date(msg.timestamp).toLocaleString();
        const role = msg.role === 'user' ? 'You' : 'BoldVision';
        return `[${timestamp}] ${role}: ${msg.content}`;
      })
      .join('\n\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boldvision-transcript-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-80 glass rounded-3xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <h3 className="font-semibold">Transcript</h3>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={downloadTranscript}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            title="Download transcript"
          >
            <Download className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Transcript Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/50">
        {messages.map((message, index) => (
          <div key={index} className="text-sm">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`font-semibold ${
                message.role === 'user' ? 'text-primary-600' : 'text-accent-600'
              }`}>
                {message.role === 'user' ? 'You' : 'BoldVision'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed pl-2 border-l-2 border-gray-200">
              {message.content}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default TranscriptPanel;
