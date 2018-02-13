import React, { PureComponent } from "react";
import { RulerIcon, CircleIcon, TextIcon } from "./Icons";

export default class MeasurementButtons extends PureComponent {
  componentDidMount() {
    this.root.addEventListener("mousedown", this.onRootMouseDown);
  }

  componentWillUnmount() {
    this.root.addEventListener("mousedown", this.onRootMouseDown);
  }

  render() {
    const rootClass = "button-bar" + (this.props.mode ? " pressed" : "");
    const lineClass =
      "line-button" + (this.props.mode === "line" ? " pressed" : "");
    const circleClass =
      "circle-button" + (this.props.mode === "circle" ? " pressed" : "");
    const textClass =
      "text-button" + (this.props.mode === "text" ? " pressed" : "");

    return (
      <div className={rootClass} ref={e => (this.root = e)}>
        <button
          type="button"
          className={lineClass}
          onClick={event => this.props.onClick("line")}
        >
          <RulerIcon />
        </button>
        <button
          type="button"
          className={circleClass}
          onClick={event => this.props.onClick("circle")}
        >
          <CircleIcon />
        </button>
        <button
          type="button"
          className={textClass}
          onClick={event => this.props.onClick("text")}
        >
          <TextIcon />
        </button>
      </div>
    );
  }

  onRootMouseDown = event => {
    event.stopPropagation();
    event.preventDefault();
  };
}
