import { useState } from 'react';

/**
 * Custom hook for navigation state management
 */
export const useNavigation = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  return {
    activeTab,
    isMobileMenuOpen,
    navigate,
    setActiveTab,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
  };
};
