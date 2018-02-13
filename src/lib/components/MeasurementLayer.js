import React, { PureComponent } from "react";
import MeasurementLayerBase from "./core/MeasurementLayerBase";
import MeasurementButtons from "./buttons/MeasurementButtons";
import { detectMouse } from "../utils/DomUtils.js";
import "./MeasurementLayer.css";

export default class MeasurementLayer extends PureComponent {
  state = { mode: null, mouseDetected: false };

  componentDidMount() {
    detectMouse(() => this.setState({ ...this.state, mouseDetected: true }));
  }

  render() {
    const hasSize = this.props.widthInPx > 0 && this.props.widthInPx > 0;
    const className =
      "measurement-layer" + (this.state.mouseDetected ? " mouse-detected" : "");
    return (
      hasSize && (
        <div className={className} ref={e => (this.root = e)}>
          <MeasurementLayerBase
            measurements={this.props.measurements}
            onChange={this.props.onChange}
            widthInPx={this.props.widthInPx}
            heightInPx={this.props.heightInPx}
            measureLine={this.props.measureLine}
            measureCircle={this.props.measureCircle}
            mode={this.state.mode}
            onCommit={this.onCommit}
          />
          <MeasurementButtons
            mode={this.state.mode}
            onClick={this.toggleMode}
          />
        </div>
      )
    );
  }

  toggleMode = mode =>
    this.setState({ mode: mode === this.state.mode ? null : mode });

  onCommit = measurement => {
    this.setState({ mode: null });
    if (this.props.onCommit) {
      this.props.onCommit(measurement);
    }
  };
}
