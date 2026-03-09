const formatTime = (time: number) => time.toString().padStart(2, '0');

export const computeDisplayTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${formatTime(minutes)}:${formatTime(seconds)}`;
};
