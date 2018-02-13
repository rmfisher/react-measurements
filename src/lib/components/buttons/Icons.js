import React from "react";

export const RulerIcon = () => {
  const path =
    "M 1 2 L 1 12 L 1 13 L 14 13 L 14 12 L 14 2 L 1 2 z M 2 3 L 3 3 L 3 5 L 2 5 L 2 3 z M 4 3 L 5 3 L 5 8 L 4 8 L 4 3 z M 6 3 " +
    "L 7 3 L 7 5 L 6 5 L 6 3 z M 8 3 L 9 3 L 9 5 L 8 5 L 8 3 z M 10 3 L 11 3 L 11 8 L 10 8 L 10 3 z M 12 3 L 13 3 L 13 5 L 12 5 L 12 3 z ";
  return (
    <svg width="15" height="15">
      <path d={path} className="ruler-icon" />
    </svg>
  );
};

export const CircleIcon = () => (
  <svg width="15" height="15">
    <circle className="circle-icon" cx="7.5" cy="7.5" r="5.5" />
  </svg>
);

export const TextIcon = () => {
  const path =
    "M 5.6367188 1 L 1 14 L 4.2617188 14 L 5.1308594 11.371094 L 9.7851562 11.371094 L 10.652344 14 L 14 14 " +
    "L 9.3632812 1 L 5.6367188 1 z M 7.4570312 4.3261719 L 9 8.9882812 L 5.9160156 8.9882812 L 7.4570312 4.3261719 z ";
  return (
    <svg width="15" height="15">
      <path d={path} className="text-icon" />
    </svg>
  );
};
