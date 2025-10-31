import { motion } from 'framer-motion';
import { Sparkles, Shield } from 'lucide-react';

function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl blur-md opacity-50"></div>
              <div className="relative bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">BoldVision</h1>
              <p className="text-xs text-gray-600">AI Financial Assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Secure & Confidential</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
