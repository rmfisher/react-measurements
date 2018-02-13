import React, { PureComponent } from "react";
import LineMeasurement from "./LineMeasurement";
import CircleMeasurement, { minRadiusInPx } from "./CircleMeasurement";
import TextAnnotation from "./TextAnnotation";
import { EditorState } from "draft-js";
import { detectMouse } from "../../utils/DomUtils.js";
import "./MeasurementLayerBase.css";

export default class MeasurementLayerBase extends PureComponent {
  createdId = null;
  state = { mouseDetected: false };

  componentDidMount() {
    this.root.addEventListener("mousedown", this.onMouseDown);
    this.root.addEventListener("click", this.onClick);
    document.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("blur", this.endDrag);

    detectMouse(() => this.setState({ ...this.state, mouseDetected: true }));
  }

  componentWillUnmount() {
    this.root.removeEventListener("mousedown", this.onMouseDown);
    this.root.removeEventListener("click", this.onClick);
    document.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("blur", this.endDrag);
  }

  render() {
    const className =
      "measurement-layer-base" +
      (this.props.mode ? " any-mode-on" : "") +
      (this.state.mouseDetected ? " mouse-detected" : "");
    return (
      <div className={className} ref={e => (this.root = e)}>
        {this.props.measurements.map(this.createMeasurementComponent)}
      </div>
    );
  }

  createMeasurementComponent = measurement => {
    if (measurement.type === "line") {
      return (
        <LineMeasurement
          key={measurement.id}
          line={measurement}
          parentWidth={this.props.widthInPx}
          parentHeight={this.props.widthInPx}
          measureLine={this.props.measureLine}
          onChange={this.onChange}
          onCommit={this.props.onCommit}
          onDeleteButtonClick={this.delete}
        />
      );
    } else if (measurement.type === "circle") {
      return (
        <CircleMeasurement
          key={measurement.id}
          circle={measurement}
          parentWidth={this.props.widthInPx}
          parentHeight={this.props.widthInPx}
          measureCircle={this.props.measureCircle}
          onChange={this.onChange}
          onCommit={this.props.onCommit}
          onDeleteButtonClick={this.delete}
        />
      );
    } else if (measurement.type === "text") {
      return (
        <TextAnnotation
          key={measurement.id}
          text={measurement}
          parentWidth={this.props.widthInPx}
          parentHeight={this.props.widthInPx}
          onChange={this.onChange}
          onCommit={this.props.onCommit}
          onDeleteButtonClick={this.delete}
        />
      );
    } else {
      return false;
    }
  };

  onMouseDown = event => {
    this.finishAnyTextEdit();
    if (event.button === 0) {
      if (this.props.mode === "line") {
        event.preventDefault();
        this.lineCreationInProgress = true;
        this.mouseXAtPress = event.clientX;
        this.mouseYAtPress = event.clientY;
      } else if (this.props.mode === "circle") {
        event.preventDefault();
        this.circleCreationInProgress = true;
        this.mouseXAtPress = event.clientX;
        this.mouseYAtPress = event.clientY;
      }
    }
  };

  onMouseMove = event => {
    if (this.lineCreationInProgress) {
      const rect = this.root.getBoundingClientRect();
      const endX = this.clamp(
        (event.clientX - rect.left) / this.props.widthInPx
      );
      const endY = this.clamp(
        (event.clientY - rect.top) / this.props.heightInPx
      );
      if (this.createdId === null) {
        this.createdId = this.getNextId();
        const startX = this.clamp(
          (this.mouseXAtPress - rect.left) / this.props.widthInPx
        );
        const startY = this.clamp(
          (this.mouseYAtPress - rect.top) / this.props.heightInPx
        );
        const line = {
          id: this.createdId,
          type: "line",
          startX,
          startY,
          endX,
          endY
        };
        this.root.classList.add("line-end-dragged");
        this.props.onChange([...this.props.measurements, line]);
      } else {
        const line = this.props.measurements.filter(
          a => a.id === this.createdId
        )[0];
        this.onChange({ ...line, endX, endY });
      }
    } else if (this.circleCreationInProgress) {
      const rect = this.root.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;
      if (this.createdId === null) {
        this.createdId = this.getNextId();
        const centerX = this.clamp(
          (this.mouseXAtPress - rect.left) / this.props.widthInPx
        );
        const centerY = this.clamp(
          (this.mouseYAtPress - rect.top) / this.props.heightInPx
        );
        const radius = this.calculateRadius(cursorX, cursorY, centerX, centerY);
        const circle = {
          id: this.createdId,
          type: "circle",
          centerX,
          centerY,
          radius
        };
        this.root.classList.add("circle-stroke-dragged");
        this.props.onChange([...this.props.measurements, circle]);
      } else {
        const circle = this.props.measurements.filter(
          a => a.id === this.createdId
        )[0];
        const radius = this.calculateRadius(
          cursorX,
          cursorY,
          circle.centerX,
          circle.centerY
        );
        this.onChange({ ...circle, radius });
      }
    }
  };

  calculateRadius = (cursorX, cursorY, centerX, centerY) => {
    const deltaX = cursorX - centerX * this.props.widthInPx;
    const deltaY = cursorY - centerY * this.props.heightInPx;
    const radiusInPx = Math.max(Math.hypot(deltaX, deltaY), minRadiusInPx);
    let radius =
      radiusInPx / Math.sqrt(this.props.widthInPx * this.props.widthInPx);

    if (centerX + radius > 1) {
      radius = 1 - centerX;
    }
    if (centerX - radius < 0) {
      radius = centerX;
    }
    if (centerY + radius > 1) {
      radius = 1 - centerY;
    }
    if (centerY - radius < 0) {
      radius = centerY;
    }
    return radius;
  };

  onMouseUp = event => this.endDrag();

  endDrag = () => {
    if (this.lineCreationInProgress) {
      this.lineCreationInProgress = false;
      if (this.createdId !== null) {
        this.root.classList.remove("line-end-dragged");
      }
    } else if (this.circleCreationInProgress) {
      this.circleCreationInProgress = false;
      if (this.createdId !== null) {
        this.root.classList.remove("circle-stroke-dragged");
      }
    }
    if (this.createdId !== null) {
      this.props.onCommit(
        this.props.measurements.filter(a => a.id === this.createdId)[0]
      );
      this.createdId = null;
    }
  };

  onClick = event => {
    if (this.props.mode === "text") {
      const id = this.getNextId();
      const rect = this.root.getBoundingClientRect();
      const arrowX = (event.clientX - rect.left) / this.props.widthInPx;
      const arrowY = (event.clientY - rect.top) / this.props.heightInPx;
      const xOffsetDirection = arrowX < 0.8 ? 1 : -1;
      const yOffsetDirection = arrowY < 0.8 ? 1 : -1;
      const textX = arrowX + xOffsetDirection * 0.05;
      const textY = arrowY + yOffsetDirection * 0.07;
      const text = {
        id,
        type: "text",
        arrowX,
        arrowY,
        textX,
        textY,
        editorState: null,
        editable: true
      };
      this.props.onChange([...this.props.measurements, text]);
      this.props.onCommit(text);
    }
  };

  getNextId = () =>
    this.props.measurements.length > 0
      ? Math.max(...this.props.measurements.map(a => a.id)) + 1
      : 0;

  onChange = m =>
    this.props.onChange(
      this.props.measurements.map(n => (m.id === n.id ? m : n))
    );

  delete = m => {
    this.props.onChange(this.props.measurements.filter(n => n.id !== m.id));
    this.props.onCommit(m);
  };

  clamp = value => Math.min(1, Math.max(0, value));

  finishAnyTextEdit = () => {
    const editable = this.props.measurements.filter(
      m => m.type === "text" && m.editable
    )[0];
    if (editable) {
      this.props.onChange(
        this.props.measurements.map(
          m => (m === editable ? this.finishEdit(m) : m)
        )
      );
    }
  };

  finishEdit = text => ({
    ...text,
    editorState: EditorState.moveFocusToEnd(
      EditorState.moveSelectionToEnd(text.editorState)
    ),
    editable: false
  });
}
