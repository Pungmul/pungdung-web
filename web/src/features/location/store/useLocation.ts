import { locationStore } from "./locationStore";

/**
 * 위치 정보와 관련된 상태 및 액션을 제공하는 훅
 */
export const useLocation = () => {
  const {
    isWatching,
    error,
    getCurrentPosition,
    startWatching,
    stopWatching,
  } = locationStore();

  return {
    // 상태
    isWatching,
    error,
    
    // 액션
    getCurrentPosition,
    startWatching,
    stopWatching,
  };
};

/**
 * 위치 감시를 자동으로 시작하고 정리하는 훅
 */
export const useLocationWatcher = () => {
  const { startWatching, stopWatching } = locationStore();
  
  return {
    startWatching,
    stopWatching,
  };
};

