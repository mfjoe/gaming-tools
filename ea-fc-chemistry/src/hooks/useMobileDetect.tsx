import { useState, useEffect } from 'react';

interface MobileDetectResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function useMobileDetect(): MobileDetectResult {
  const [deviceInfo, setDeviceInfo] = useState<MobileDetectResult>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        orientation: 'landscape',
        screenSize: 'lg',
      };
    }

    return detectDevice();
  });

  useEffect(() => {
    function handleResize() {
      setDeviceInfo(detectDevice());
    }

    function handleOrientationChange() {
      // Add small delay for orientation change to complete
      setTimeout(() => {
        setDeviceInfo(detectDevice());
      }, 100);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
}

function detectDevice(): MobileDetectResult {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Determine screen size
  let screenSize: MobileDetectResult['screenSize'];
  if (width < 640) screenSize = 'sm';
  else if (width < 768) screenSize = 'md';
  else if (width < 1024) screenSize = 'lg';
  else if (width < 1280) screenSize = 'xl';
  else screenSize = '2xl';

  // Determine device type
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  // Determine orientation
  const orientation = height > width ? 'portrait' : 'landscape';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    orientation,
    screenSize,
  };
}

/**
 * Hook for online/offline status
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Offline Banner Component
 */
export function OfflineBanner(): JSX.Element | null {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 text-center font-semibold">
      ⚠️ You're offline. Some features may not work. Using cached data.
    </div>
  );
}

