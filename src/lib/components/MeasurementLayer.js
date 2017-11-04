import React, { PureComponent } from 'react';
import MeasurementLayerBase from './core/MeasurementLayerBase';
import MeasurementButtons from './buttons/MeasurementButtons';
import PropTypes from 'prop-types';
import './MeasurementLayer.css';

class MeasurementLayer extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { mode: null };
  }

  render() {
    const hasSize = this.props.width > 0 && this.props.height > 0;
    return (
      hasSize && <div className='measurement-layer'>
        <MeasurementLayerBase
          measurements={this.props.measurements}
          onChange={this.props.onChange}
          width={this.props.width}
          height={this.props.height}
          measureLine={this.props.measureLine}
          measureCircle={this.props.measureCircle}
          formatDistance={this.props.formatDistance}
          formatArea={this.props.formatArea}
          mode={this.state.mode}
          onRelease={this.onRelease}
        />
        <MeasurementButtons mode={this.state.mode} onClick={this.updateMode} />
      </div>
    );
  }

  updateMode = mode => this.setState({ mode: mode === this.state.mode ? null : mode });

  onRelease = measurements => {
    this.setState({ mode: null });
    if (this.props.onRelease) {
      this.props.onRelease(measurements);
    }
  }
}

MeasurementLayer.propTypes = {
  // Required:
  measurements: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  measureLine: PropTypes.func.isRequired,
  measureCircle: PropTypes.func.isRequired,
  formatDistance: PropTypes.func.isRequired,
  formatArea: PropTypes.func.isRequired,

  // Optional:
  onRelease: PropTypes.func,
};

export default MeasurementLayer;