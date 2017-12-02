import React, { PureComponent } from 'react';
import MeasuredImage from './MeasuredImage';
import './MeasurementApp.css';

export default class MeasurementApp extends PureComponent {

  render() {
    return (
      <div className='container'>
        <div className='title-bar'>
          <span className='title-text'>React Measurements</span>
          <div className='splitter'></div>
          <a href='https://www.npmjs.com/packages/react-measurements'>v0.6.0</a>
          <a href='https://github.com/rmfisher/react-measurements'>GitHub</a>
        </div>
        <div className='content'>
          <div className='measurements-body'>
            <div>
              <MeasuredImage />
            </div>
            <p>Fig. 1: Pollen grains under an electron microscope.</p>
          </div>
        </div>
      </div>
    );
  }
}