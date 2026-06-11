'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

export default function HeaderProgressBar() {
  const pathname = usePathname(); 
  const searchParams = useSearchParams();

  useEffect(() => {
    const my = NProgress.configure({
        showSpinner: false,
    });
    const handleStart = () => my.start();
    const handleComplete = () => my.done();

    handleStart(); // 경로 변경 시 NProgress 시작

    // 라우팅이 완료되면 NProgress 종료
    handleComplete();

    // 컴포넌트가 언마운트될 때 클린업
    return () => {
        my.done();
    };
  }, [pathname, searchParams]); // pathname이 변경될 때마다 실행

  return null;
};
