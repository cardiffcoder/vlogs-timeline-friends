import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      const firstVideoHeight = window.innerHeight - 128; // Viewport height minus header height
      
      // Show header when near the top of the first video
      if (currentScrollY < firstVideoHeight * 0.5) {
        setIsVisible(true);
      } 
      // Hide header when scrolling down past first video
      else if (currentScrollY > lastScrollY && currentScrollY > firstVideoHeight) {
        setIsVisible(false);
      } 
      // Show header when scrolling up significantly
      else if (currentScrollY < lastScrollY - 50) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return isVisible;
}