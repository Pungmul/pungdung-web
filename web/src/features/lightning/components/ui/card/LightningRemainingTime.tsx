"use client";

import { memo, useEffect, useState } from "react";

import dayjs from "dayjs";

interface LightningRemainingTimeProps {
  recruitmentEndTime: string;
}

export const LightningRemainingTime = memo(function LightningRemainingTime({
  recruitmentEndTime,
}: LightningRemainingTimeProps) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const updatedRecruitmentEndTime = dayjs(recruitmentEndTime).tz();
      const updatedNow = dayjs().tz();
      const diffSeconds = updatedRecruitmentEndTime.diff(updatedNow, "seconds");

      if (diffSeconds < 0) {
        setRemainingTime(0);
        return;
      }

      if (diffSeconds < 60) {
        setRemainingTime(diffSeconds);
        return;
      }

      setRemainingTime(Math.floor(diffSeconds / 60) * 60);
    };

    calculateRemainingTime();
    const timer = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [recruitmentEndTime]);

  return (
    <div className="text-grey-800 text-[14px] font-semibold">
      {remainingTime >= 60
        ? Math.floor(remainingTime / 60) + "분 후 마감"
        : remainingTime + "초 후 마감"}
    </div>
  );
});
