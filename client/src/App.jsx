import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import ContactModal from './components/ContactModal';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {!sessionId ? (
        <WelcomeScreen onStart={setSessionId} />
      ) : (
        <ChatInterface
          sessionId={sessionId}
          contactInfo={contactInfo}
          onContactUpdate={setContactInfo}
          onShowContactModal={() => setShowContactModal(true)}
        />
      )}

      {showContactModal && (
        <ContactModal
          sessionId={sessionId}
          contactInfo={contactInfo}
          onClose={() => setShowContactModal(false)}
          onUpdate={setContactInfo}
        />
      )}
    </div>
  );
}

export default App;
