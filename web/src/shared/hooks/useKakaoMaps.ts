"use client";

import { useEffect } from "react";

import { kakaoMapsStore } from "@/shared/store";

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services&autoload=false`;

interface UseKakaoMapsReturn {
  kakaoMapsLoaded: boolean;
  error: string | null;
  isInitializing: boolean;
}

/**
 * 카카오 지도 SDK를 전역적으로 로드하고 관리하는 훅
 * 여러 컴포넌트에서 공유하여 사용할 수 있습니다.
 */
export function useKakaoMaps(): UseKakaoMapsReturn {
  const kakaoMapsLoaded = kakaoMapsStore((state) => state.kakaoMapsLoaded);
  const error = kakaoMapsStore((state) => state.error);
  const isInitializing = kakaoMapsStore((state) => state.isInitializing);
  const setIsInitializing = kakaoMapsStore().setIsInitializing;
  const setLoaded = kakaoMapsStore().setLoaded;
  const setError = kakaoMapsStore().setError;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (kakaoMapsLoaded) {
      return;
    }

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setLoaded();
      });
      return;
    }

    if (isInitializing) {
      return;
    }

    const scriptSelector = `script[src="${KAKAO_SDK_URL}"]`;
    const existingScript =
      document.querySelector<HTMLScriptElement>(scriptSelector);

    const handleLoad = () => {
      window.kakao.maps.load(() => {
        setLoaded();
      });
    };

    const handleError = () => {
      setError("카카오 지도 SDK 로드에 실패했습니다.");
    };

    setIsInitializing(true);
    setError(null);

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = KAKAO_SDK_URL;

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [kakaoMapsLoaded, isInitializing, setError, setIsInitializing, setLoaded]);

  return {
    kakaoMapsLoaded,
    error,
    isInitializing,
  };
}

type KakaoMapsEffectCallback = () => void | (() => void);

/**
 * 카카오 지도가 로드된 후 콜백을 실행하는 훅
 */
export function useKakaoMapsEffect(callback: KakaoMapsEffectCallback) {
  const { kakaoMapsLoaded } = useKakaoMaps();

  useEffect(() => {
    let cleanup: void | (() => void);
    let isMounted = true;

    if (kakaoMapsLoaded) {
      window.kakao.maps.load(() => {
        if (!isMounted) return;

        cleanup = callback();
      });
    }

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [kakaoMapsLoaded, callback]);
}
