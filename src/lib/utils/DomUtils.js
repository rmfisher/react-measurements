export const detectMouse = callback => {
  let timer = null;
  let removeListeners = null;

  const onTimerFinished = () => {
    callback();
    if (removeListeners) {
      removeListeners();
    }
  };

  const startTimer = e => {
    if (!timer) {
      timer = setTimeout(onTimerFinished, 300);
    }
  };

  const clearTimer = e => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  removeListeners = () => {
    document.removeEventListener("mousemove", startTimer);
    document.removeEventListener("touchstart", clearTimer);
    document.removeEventListener("touchmove", clearTimer);
    document.removeEventListener("touchend", clearTimer);
    document.removeEventListener("click", clearTimer);
  };

  document.addEventListener("mousemove", startTimer);
  document.addEventListener("touchstart", clearTimer);
  document.addEventListener("touchmove", clearTimer);
  document.addEventListener("touchend", clearTimer);
  document.addEventListener("click", clearTimer);
};
