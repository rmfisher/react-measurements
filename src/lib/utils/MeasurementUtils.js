export const calculateDistance = (line, physicalWidth, physicalHeight) => {
  const deltaX = (line.endX - line.startX) * physicalWidth;
  const deltaY = (line.endY - line.startY) * physicalHeight;
  return Math.hypot(deltaX, deltaY);
};

export const calculateArea = (circle, physicalWidth, physicalHeight) => {
  return (
    Math.PI * circle.radius * circle.radius * physicalWidth * physicalHeight
  );
};
