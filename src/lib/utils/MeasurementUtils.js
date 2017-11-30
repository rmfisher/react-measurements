export const measureLine = (physicalWidth, physicalHeight) => line => {
  const deltaX = (line.endX - line.startX) * physicalWidth;
  const deltaY = (line.endY - line.startY) * physicalHeight;
  return Math.hypot(deltaX, deltaY);
}

export const measureCircle = (physicalWidth, physicalHeight) => circle => {
  return Math.PI * circle.radius * circle.radius * physicalWidth * physicalHeight;
}