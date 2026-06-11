"use client";

import { useEffect } from 'react';

import { Spinner } from '@/shared/components';

import { useLogoutActions } from '@/features/auth/hooks/actions';

export default function Logout() {
  const { logout } = useLogoutActions();

  useEffect(() => {
    void logout();
  }, [logout]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center gap-4">
        <Spinner />
        <p className="text-gray-600">로그아웃 중...</p>
      </div>
    </div>
  );
}