import React from 'react';
import './TitleBar.css';

const TitleBar = () => (
  <div className='title-bar-background'>
    <div className='title-bar'>
      <ReactMeasurementsIcon />
      <div className='title-text'>React Measurements</div>
      <div className='title-links'>
        <a href='https://github.com/rmfisher/react-measurements'>GitHub</a>
        <a href='https://www.npmjs.com/packages/react-measurements'>NPM</a>
      </div>
    </div>
  </div>
);

const ReactMeasurementsIcon = () => {
  const path = 'M 0 1 L 0 14 L 15 14 L 15 1 L 0 1 z M 2 3 L 3 3 L 3 5 L 2 5 L 2 3 z M 4 3 L 5 3 L 5 8 L 4 8 L 4 3 z M 6 3 L 7 3 L 7 5 '
    + 'L 6 5 L 6 3 z M 8 3 L 9 3 L 9 5 L 8 5 L 8 3 z M 10 3 L 11 3 L 11 8 L 10 8 L 10 3 z M 12 3 L 13 3 L 13 5 L 12 5 L 12 3 z';
  return (
    <svg width='15' height='15'>
      <path d={path} className='react-measurements-icon-path' />
    </svg>
  );
}

export default TitleBar;