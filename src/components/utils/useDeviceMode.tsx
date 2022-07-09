import { useEffect, useState } from 'react';

function useDeviceMode() {
  const [deviceMode, setDeviceMode] = useState(window.innerWidth > 700 ? 'desktop' : 'mobile');

  useEffect(() => {
    function handleSize() {
      if (window.innerWidth > 700) setDeviceMode('desktop');
      else setDeviceMode('mobile');
    }
    window.addEventListener('resize', handleSize);
    handleSize();
    return () => window.removeEventListener('resize', handleSize);
  }, []);

  return deviceMode;
}

export default useDeviceMode;
