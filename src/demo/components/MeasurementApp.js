import React, { PureComponent } from 'react';
import TitleBar from './TitleBar';
import PollenImage from './PollenImage';
import './MeasurementApp.css';

class MeasurementApp extends PureComponent {

  render() {
    return (
      <div className='container'>
        <TitleBar />
        <div className='content'>
          <div className='measurements-body'>
            <div>
              <PollenImage />
            </div>
            <p>Fig. 1: Pollen grains under an electron microscope.</p>
          </div>
        </div>
      </div >
    );
  }
}

export default MeasurementApp;