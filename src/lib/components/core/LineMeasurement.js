import React, { PureComponent } from "react";
import TextAnchor from "./TextAnchor";

const edgeLength = 15;
const textOffset = 16;
const quarterCircle = Math.PI / 2;

export default class LineMeasurement extends PureComponent {
  state = { midHover: false };

  componentDidMount() {
    this.startGrabber.addEventListener("mousedown", this.onStartMouseDown);
    this.midGrabber.addEventListener("mousedown", this.onMidMouseDown);
    this.midGrabber.addEventListener("mouseenter", this.onMidMouseEnter);
    this.midGrabber.addEventListener("mouseleave", this.onMidMouseLeave);
    this.endGrabber.addEventListener("mousedown", this.onEndMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("blur", this.endDrag);
  }

  componentWillUnmount() {
    this.startGrabber.removeEventListener("mousedown", this.onStartMouseDown);
    this.midGrabber.removeEventListener("mousedown", this.onMidMouseDown);
    this.midGrabber.removeEventListener("mouseenter", this.onMidMouseEnter);
    this.midGrabber.removeEventListener("mouseleave", this.onMidMouseLeave);
    this.endGrabber.removeEventListener("mousedown", this.onEndMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("blur", this.endDrag);
  }

  render() {
    // Line layout:
    const startX = this.props.line.startX * this.props.parentWidth;
    const startY = this.props.line.startY * this.props.parentHeight;
    const endX = this.props.line.endX * this.props.parentWidth;
    const endY = this.props.line.endY * this.props.parentHeight;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const rotate = Math.atan2(deltaY, deltaX);
    const edgeX = edgeLength * Math.sin(rotate) / 2.0;
    const edgeY = edgeLength * Math.cos(rotate) / 2.0;

    // Text layout (make sure the text is never rotated so much to be upside down):
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    const rotateIsSmall = Math.abs(rotate) <= quarterCircle;
    const offsetX = (rotateIsSmall ? -1 : 1) * textOffset * Math.sin(rotate);
    const offsetY = (rotateIsSmall ? 1 : -1) * textOffset * Math.cos(rotate);
    const textX = centerX + offsetX;
    const textY = centerY + offsetY;
    const textRotate = Math.atan2(offsetY, offsetX) - quarterCircle;

    const text = this.props.measureLine(this.props.line);
    const rootClassName =
      "line-measurement" + (this.state.midHover ? " mid-hover" : "");

    return (
      <div className={rootClassName} ref={e => (this.root = e)}>
        <svg className="measurement-svg">
          <g className="grabber-group">
            <line
              className="grabber mid-grabber"
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              ref={e => (this.midGrabber = e)}
            />
            <line
              className="line mid-line"
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              ref={e => (this.midLine = e)}
            />
          </g>
          <g className="grabber-group">
            <line
              className="grabber start-grabber"
              x1={startX - edgeX}
              y1={startY + edgeY}
              x2={startX + edgeX}
              y2={startY - edgeY}
              ref={e => (this.startGrabber = e)}
            />
            <line
              className="line start-line"
              x1={startX - edgeX}
              y1={startY + edgeY}
              x2={startX + edgeX}
              y2={startY - edgeY}
              ref={e => (this.startLine = e)}
            />
          </g>
          <g className="grabber-group">
            <line
              className="grabber end-grabber"
              x1={endX - edgeX}
              y1={endY + edgeY}
              x2={endX + edgeX}
              y2={endY - edgeY}
              ref={e => (this.endGrabber = e)}
            />
            <line
              className="line end-line"
              x1={endX - edgeX}
              y1={endY + edgeY}
              x2={endX + edgeX}
              y2={endY - edgeY}
              ref={e => (this.endLine = e)}
            />
          </g>
        </svg>
        <TextAnchor
          x={textX}
          y={textY}
          rotate={textRotate}
          onDeleteButtonClick={this.onDeleteButtonClick}
        >
          <div className="measurement-text" ref={e => (this.text = e)}>
            {text}
          </div>
        </TextAnchor>
      </div>
    );
  }

  onStartMouseDown = event => {
    if (event.button === 0) {
      this.startDragInProgress = true;
      event.preventDefault();
      this.onDragBegin(event.clientX, event.clientY);
    }
  };

  onMidMouseDown = event => {
    if (event.button === 0) {
      this.midDragInProgress = true;
      event.preventDefault();
      this.onDragBegin(event.clientX, event.clientY);
    }
  };

  onEndMouseDown = event => {
    if (event.button === 0) {
      this.endDragInProgress = true;
      event.preventDefault();
      this.onDragBegin(event.clientX, event.clientY);
    }
  };

  onDragBegin = (eventX, eventY) => {
    this.mouseXAtPress = eventX;
    this.mouseYAtPress = eventY;
    this.lineAtPress = this.props.line;
    this.startXAtPress = this.props.line.startX * this.props.parentWidth;
    this.startYAtPress = this.props.line.startY * this.props.parentHeight;
    this.endXAtPress = this.props.line.endX * this.props.parentWidth;
    this.endYAtPress = this.props.line.endY * this.props.parentHeight;
  };

  onMouseMove = event => this.onDrag(event.clientX, event.clientY);

  onDrag = (eventX, eventY) => {
    if (
      (this.startDragInProgress ||
        this.endDragInProgress ||
        this.midDragInProgress) &&
      !this.dragOccurred
    ) {
      this.dragOccurred = true;
      this.toggleDragStyles();
    }

    if (this.startDragInProgress) {
      const startX = this.clamp(this.getXAfterDrag(this.startXAtPress, eventX));
      const startY = this.clamp(this.getYAfterDrag(this.startYAtPress, eventY));
      this.props.onChange({ ...this.props.line, startX, startY });
    } else if (this.endDragInProgress) {
      const endX = this.clamp(this.getXAfterDrag(this.endXAtPress, eventX));
      const endY = this.clamp(this.getYAfterDrag(this.endYAtPress, eventY));
      this.props.onChange({ ...this.props.line, endX, endY });
    } else if (this.midDragInProgress) {
      let startX = this.getXAfterDrag(this.startXAtPress, eventX);
      let startY = this.getYAfterDrag(this.startYAtPress, eventY);
      let endX = this.getXAfterDrag(this.endXAtPress, eventX);
      let endY = this.getYAfterDrag(this.endYAtPress, eventY);
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Don't let the line be dragged outside the layer bounds:
      if (startX < 0) {
        startX = 0;
        endX = deltaX;
      } else if (startX > 1) {
        startX = 1;
        endX = 1 + deltaX;
      }
      if (startY < 0) {
        startY = 0;
        endY = deltaY;
      } else if (startY > 1) {
        startY = 1;
        endY = 1 + deltaY;
      }
      if (endX < 0) {
        startX = -deltaX;
        endX = 0;
      } else if (endX > 1) {
        startX = 1 - deltaX;
        endX = 1;
      }
      if (endY < 0) {
        startY = -deltaY;
        endY = 0;
      } else if (endY > 1) {
        startY = 1 - deltaY;
        endY = 1;
      }
      this.props.onChange({ ...this.props.line, startX, startY, endX, endY });
    }
  };

  getXAfterDrag = (xAtPress, clientX) =>
    (xAtPress + clientX - this.mouseXAtPress) / this.props.parentWidth;

  getYAfterDrag = (yAtPress, clientY) =>
    (yAtPress + clientY - this.mouseYAtPress) / this.props.parentHeight;

  onMouseUp = event => this.endDrag();

  endDrag = () => {
    if (this.dragOccurred) {
      this.toggleDragStyles();
      this.dragOccurred = false;
    }
    const anyDragAttempted =
      this.startDragInProgress ||
      this.midDragInProgress ||
      this.endDragInProgress;
    if (this.startDragInProgress) {
      this.startDragInProgress = false;
    }
    if (this.midDragInProgress) {
      this.midDragInProgress = false;
    }
    if (this.endDragInProgress) {
      this.endDragInProgress = false;
    }
    if (anyDragAttempted && this.didValuesChange()) {
      this.props.onCommit(this.props.line);
    }
  };

  didValuesChange = () =>
    this.props.line.startX !== this.lineAtPress.startX ||
    this.props.line.startY !== this.lineAtPress.startY ||
    this.props.line.endX !== this.lineAtPress.endX ||
    this.props.line.endY !== this.lineAtPress.endY;

  onMidMouseEnter = event => this.setState({ ...this.state, midHover: true });

  onMidMouseLeave = event => this.setState({ ...this.state, midHover: false });

  getAnnotationLayerClassList = () => this.root.parentElement.classList;

  clamp = value => Math.min(1, Math.max(0, value));

  toggleDragStyles = () => {
    if (this.startDragInProgress) {
      this.startLine.classList.toggle("dragged");
      this.startGrabber.classList.toggle("dragged");
      this.getAnnotationLayerClassList().toggle("line-start-dragged");
    }
    if (this.midDragInProgress) {
      this.startLine.classList.toggle("dragged");
      this.midLine.classList.toggle("dragged");
      this.endLine.classList.toggle("dragged");
      this.startGrabber.classList.toggle("dragged");
      this.midGrabber.classList.toggle("dragged");
      this.endGrabber.classList.toggle("dragged");
      this.getAnnotationLayerClassList().toggle("line-mid-dragged");
    }
    if (this.endDragInProgress) {
      this.endLine.classList.toggle("dragged");
      this.endGrabber.classList.toggle("dragged");
      this.getAnnotationLayerClassList().toggle("line-end-dragged");
    }
    this.getAnnotationLayerClassList().toggle("any-dragged");
  };

  onDeleteButtonClick = () => this.props.onDeleteButtonClick(this.props.line);
}
