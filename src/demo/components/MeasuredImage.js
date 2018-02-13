import React, { PureComponent } from "react";
import MeasurementLayer from "../../lib/components/MeasurementLayer";
import {
  calculateDistance,
  calculateArea
} from "../../lib/utils/MeasurementUtils";
import { EditorState, ContentState } from "draft-js";
import pollenImage from "../images/pollen.jpg";

export default class MeasuredImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      measurements: this.createInitialState(),
      widthInPx: 0,
      heightInPx: 0
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onImageBoundsChanged);
    this.onImageBoundsChanged();
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.onImageBoundsChanged);
  }

  render() {
    return (
      <div className="square-parent">
        <div className="square-child">
          <img
            src={pollenImage}
            alt="Pollen grains"
            ref={e => (this.image = e)}
            onLoad={this.onLoad}
          />
          <MeasurementLayer
            measurements={this.state.measurements}
            widthInPx={this.state.widthInPx}
            heightInPx={this.state.heightInPx}
            onChange={this.onChange}
            measureLine={this.measureLine}
            measureCircle={this.measureCircle}
          />
        </div>
      </div>
    );
  }

  onChange = measurements => this.setState({ ...this.state, measurements });

  measureLine = line => Math.round(calculateDistance(line, 300, 300)) + " μm";

  measureCircle = circle =>
    Math.round(calculateArea(circle, 300, 300) / 10) * 10 + " μm²";

  onImageBoundsChanged = event => {
    const imageBounds = this.image.getBoundingClientRect();
    this.setState({
      ...this.state,
      widthInPx: imageBounds.width,
      heightInPx: imageBounds.height
    });
  };

  onLoad = () => {
    this.onImageBoundsChanged();
    this.props.onImageLoaded();
  };

  createInitialState = () => [
    {
      id: 0,
      type: "line",
      startX: 0.183,
      startY: 0.33,
      endX: 0.316,
      endY: 0.224
    },
    {
      id: 1,
      type: "circle",
      centerX: 0.863,
      centerY: 0.414,
      radius: 0.0255
    },
    {
      id: 2,
      type: "text",
      arrowX: 0.482,
      arrowY: 0.739,
      textX: 0.54,
      textY: 0.82,
      editorState: EditorState.createWithContent(
        ContentState.createFromText("Pollen Grain")
      )
    }
  ];
}
