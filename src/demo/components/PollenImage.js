import React, { PureComponent } from 'react';
import MeasurementLayer from '../../lib/components/MeasurementLayer';
import { measureLine, measureCircle } from '../../lib/logic/MeasurementUtils';
import pollenImage from '../images/pollen.jpg';
import { EditorState, ContentState } from 'draft-js';

class PollenImage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { measurements: this.createInitialState(), width: 0, height: 0 };
    this.onChange = measurements => this.setState({ ...this.state, measurements });
  }

  componentDidMount() {
    window.addEventListener('resize', this.onImageBoundsChanged);
    this.onImageBoundsChanged();
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.onImageBoundsChanged);
  }

  render() {
    return (
      <div className='square-parent'>
        <div className='square-child'>
          <img
            src={pollenImage}
            alt='Pollen grains'
            ref={e => this.image = e}
            onLoad={this.onImageBoundsChanged}
          />
          <MeasurementLayer
            measurements={this.state.measurements}
            width={this.state.width}
            height={this.state.height}
            onChange={this.onChange}
            measureLine={measureLine(300, 300)}
            measureCircle={measureCircle(300, 300)}
            formatDistance={this.formatDistance}
            formatArea={this.formatArea}
          />
        </div>
      </div>
    );
  }

  formatDistance = d => Math.round(d) + ' μm';

  formatArea = a => (Math.round(a / 10) * 10) + ' μm²';

  onImageBoundsChanged = event => {
    const imageBounds = this.image.getBoundingClientRect();
    this.setState({ ...this.state, width: imageBounds.width, height: imageBounds.height });
  }

  createInitialState = () => [
    {
      "id": 0,
      "type": "line",
      "startX": 0.183,
      "startY": 0.33,
      "endX": 0.316,
      "endY": 0.224,
    },
    {
      "id": 1,
      "type": "circle",
      "centerX": 0.863,
      "centerY": 0.414,
      "radius": 0.0255,
    },
    {
      "id": 2,
      "type": "text",
      "arrowX": 0.482,
      "arrowY": 0.739, "textX": 0.532,
      "textY": 0.809,
      "editorState": EditorState.createWithContent(ContentState.createFromText("Pollen Grain")),
    }
  ];
}

export default PollenImage;