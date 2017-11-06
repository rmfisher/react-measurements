import React, { PureComponent } from 'react';
import PollenImage from './PollenImage';
import './MeasurementApp.css';

class MeasurementApp extends PureComponent {

  render() {
    return (
      <div className='container'>
        <div className='title-bar'>
          <span className='title-text'>React Measurements</span>
          <div className='splitter'></div>
          <a href='https://www.npmjs.com/packages/react-measurements'>v0.2.4</a>
          <a href='https://github.com/rmfisher/react-measurements'>GitHub</a>
        </div>
        <div className='content'>
          <div className='measurements-body'>
            <div>
              <PollenImage />
            </div>
            <p>Fig. 1: Pollen grains under an electron microscope.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default MeasurementApp;