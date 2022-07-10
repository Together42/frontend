import { useEffect, useState } from 'react';

function useWindowWidth(): [number, React.Dispatch<React.SetStateAction<boolean>>] {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isTurnOn, setIsTurnOn] = useState(false);

  useEffect(() => {
    function getWidth() {
      setWindowWidth(window.innerWidth);
    }
    if (isTurnOn) {
      window.addEventListener('resize', getWidth);
      getWidth();
      return () => window.removeEventListener('resize', getWidth);
    }
  }, [isTurnOn]);

  return [windowWidth, setIsTurnOn];
}

export default useWindowWidth;
