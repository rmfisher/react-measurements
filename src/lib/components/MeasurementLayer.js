import React, { PureComponent } from "react";
import MeasurementLayerBase from "./core/MeasurementLayerBase";
import MeasurementButtons from "./buttons/MeasurementButtons";
import "./MeasurementLayer.css";

export default class MeasurementLayer extends PureComponent {
  state = { mode: null };

  render() {
    const hasSize = this.props.widthInPx > 0 && this.props.heightInPx > 0;
    return (
      hasSize && (
        <div className="measurement-layer" ref={e => (this.root = e)}>
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
