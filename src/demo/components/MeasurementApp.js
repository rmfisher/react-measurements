import React, { PureComponent } from 'react';
import TitleBar from './TitleBar';
import PollenImage from './PollenImage';
import './MeasurementApp.css';

class MeasurementApp extends PureComponent {

  render() {
    return (
      <div class='container'>
        <TitleBar />
        <div class='content'>
          <div className='measurements-body'>
            <PollenImage />
            <p>Fig. 1: Pollen grains under an electron microscope.</p>
          </div>
        </div>
      </div >
    );
  }
}

export default MeasurementApp;