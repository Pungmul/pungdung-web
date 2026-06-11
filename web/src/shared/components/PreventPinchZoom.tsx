'use client';

import { useEffect } from "react";

export function PinchZoomPreventionScript() {
    useEffect(() => {
        // 모바일 장치에서 핀치 줌 방지
        const preventZoom = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };

        document.addEventListener('touchmove', preventZoom, { passive: false });

        // 이중 탭 줌 방지
        let lastTouchEnd = 0;
        const preventDoubleTapZoom = (e: TouchEvent) => {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        };

        document.addEventListener('touchend', preventDoubleTapZoom, false);

        // 클린업 함수
        return () => {
            document.removeEventListener('touchmove', preventZoom);
            document.removeEventListener('touchend', preventDoubleTapZoom);
        };
    }, []);

    return (null)
}