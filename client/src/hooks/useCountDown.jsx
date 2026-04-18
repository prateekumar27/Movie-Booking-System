import { use, useEffect, useState } from "react";

export const useCountdown = ({ initialTimeInSeconds }) => {
  const [timeInSecond, setTimeInSecond] = useState(initialTimeInSeconds);

  useEffect(() => {
    const interValId = setInterval(() => {
      setTimeInSecond((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interValId);
  }, []);
  const min = Math.floor(timeInSecond / 60);
  const sec = timeInSecond % 60;

  const displayTime = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
  return { displayTime };
};
