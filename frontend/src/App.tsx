import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LandingPage from './components/landing/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import Marketplace from './components/dashboard/Marketplace';
import CarbonProjects from './components/carbon/CarbonProjects';
import CarbonNews from './components/carbon/CarbonNews';
import Modal from './components/ui/Modal';
import RegisterLogin from './components/auth/RegisterLogin';

type Page = 'dashboard' | 'marketplace' | 'projects' | 'news';

const AppContent: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activePage, setActivePage] = useState<Page>('dashboard');

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header 
        onOpenAuthModal={() => setShowAuthModal(true)} 
        activePage={activePage} 
        onPageChange={setActivePage}
      />
      
      <main className="flex-grow">
        {isLoggedIn ? (
          {
            'dashboard': <Dashboard />,
            'marketplace': <Marketplace />,
            'projects': <CarbonProjects />,
            'news': <CarbonNews />
          }[activePage]
        ) : (
          <LandingPage onOpenAuthModal={() => setShowAuthModal(true)} />
        )}
      </main>
      
      <Footer />
      
      <Modal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        title="Login or Register"
      >
        <RegisterLogin onSuccess={handleAuthSuccess} />
      </Modal>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;