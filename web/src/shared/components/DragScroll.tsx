"use client";
import React, { useCallback,useRef, useState } from 'react';

interface DragScrollProps {
    children: React.ReactNode;
    className?: string;
}

const DragScroll: React.FC<DragScrollProps> = ({ children, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const startYRef = useRef(0);
    const scrollTopRef = useRef(0);
    const refreshRef = useRef<HTMLDivElement>(null)

    const handlePointerDown = useCallback((e: React.PointerEvent) => {

        if (!containerRef.current) return;

        // 초기 위치와 스크롤 위치 저장
        startYRef.current = e.clientY;
        scrollTopRef.current = containerRef.current.scrollTop;
        if (refreshRef.current) {
            refreshRef.current.style.willChange = 'height';
        }

        setIsDragging(true);
        
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging || !containerRef.current) return;

        // 드래그된 거리 계산
        containerRef.current.setPointerCapture(e.pointerId);

        const deltaY = e.clientY - startYRef.current;
        // 스크롤 위치 업데이트
        containerRef.current.scrollTop = scrollTopRef.current - deltaY;

        // 맨 위로 스크롤 시 새로 고침 UI 표시
        if (containerRef.current.scrollTop <= 0 && refreshRef.current) {
            console.log(scrollTopRef.current - deltaY)
            refreshRef.current.style.height = `${scrollTopRef.current - deltaY}px`;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isDragging]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if (!containerRef.current) return;

        // 포인터 캡처 해제
        containerRef.current.releasePointerCapture(e.pointerId);
        setIsDragging(false);
    }, []);


    return (
        <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`
                ${className? className : ''} 
                overflow-auto 
                cursor-grab 
                ${isDragging ? 'cursor-grabbing' : ''}
                `}
            style={{
                // 스크롤바 숨기기 (선택사항)
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
        >

            {children}
        </div>
    );
};

export default DragScroll;