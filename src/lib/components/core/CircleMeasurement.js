import React, { PureComponent } from 'react';
import TextAnchor from './TextAnchor';

const textOffset = 16;
const minRadiusInPixels = 3;

class CircleMeasurement extends PureComponent {

  componentDidMount() {
    this.fill.addEventListener('mousedown', this.onFillDown);
    this.stroke.addEventListener('mousedown', this.onStrokeDown);
    document.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('blur', this.endDrag);
  }

  componentWillUnmount() {
    this.fill.removeEventListener('mousedown', this.onFillDown);
    this.stroke.removeEventListener('mousedown', this.onStrokeDown);
    document.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('blur', this.endDrag);
  }

  render() {
    const centerX = this.props.circle.centerX * this.props.parentWidth;
    const centerY = this.props.circle.centerY * this.props.parentHeight;
    const radius = this.props.circle.radius * Math.sqrt(this.props.parentWidth * this.props.parentHeight);
    const textY = centerY + radius + textOffset;
    const text = this.props.formatArea(this.props.measureCircle(this.props.circle));

    return (
      <div className='circle-measurement' ref={e => this.root = e}>
        <TextAnchor x={centerX} y={textY} onDeleteButtonClick={this.onDeleteButtonClick}>
          <div className='measurement-text' ref={e => this.text = e}>{text}</div>
        </TextAnchor>
        <svg className='measurement-svg'>
          <g className='grabber-group'>
            <circle className='fill-grabber' cx={centerX} cy={centerY} r={radius} ref={e => this.fill = e} />
            <circle className='stroke-grabber' cx={centerX} cy={centerY} r={radius} ref={e => this.stroke = e} />
            <circle className='circle' cx={centerX} cy={centerY} r={radius} ref={e => this.circle = e} />
          </g>
        </svg>
      </div >
    );
  }

  onStrokeDown = event => {
    if (event.button === 0) {
      this.strokeDragInProgress = true;
      this.onDragBegin(event);
    }
  }

  onFillDown = event => {
    if (event.button === 0) {
      this.fillDragInProgress = true;
      this.onDragBegin(event);
    }
  }

  onDragBegin = event => {
    event.preventDefault();
    this.mouseXAtPress = event.clientX;
    this.mouseYAtPress = event.clientY;
    this.circleAtPress = this.props.circle;
    this.centerXAtPress = this.props.circle.centerX * this.props.parentWidth;
    this.centerYAtPress = this.props.circle.centerY * this.props.parentHeight;
    this.radiusAtPress = this.props.circle.radius * Math.sqrt(this.props.parentWidth * this.props.parentHeight);
  }

  onMouseMove = event => {
    if ((this.fillDragInProgress || this.strokeDragInProgress) && !this.dragOccurred) {
      this.dragOccurred = true;
      this.toggleDragStyles();
    }

    const clientX = event.clientX;
    const clientY = event.clientY;

    if (this.strokeDragInProgress) {
      const rect = this.root.getBoundingClientRect();
      const centerClientX = this.centerXAtPress + rect.left;
      const centerClientY = this.centerYAtPress + rect.top;
      const deltaX = clientX - centerClientX;
      const deltaY = clientY - centerClientY;
      let radius = Math.max(Math.hypot(deltaX, deltaY), minRadiusInPixels) / Math.sqrt(this.props.parentWidth * this.props.parentHeight);

      if (this.props.circle.centerX + radius > 1) {
        radius = 1 - this.props.circle.centerX;
      }
      if (this.props.circle.centerX - radius < 0) {
        radius = this.props.circle.centerX;
      }
      if (this.props.circle.centerY + radius > 1) {
        radius = 1 - this.props.circle.centerY;
      }
      if (this.props.circle.centerY - radius < 0) {
        radius = this.props.circle.centerY;
      }
      this.props.onChange({ ...this.props.circle, radius });

    } else if (this.fillDragInProgress) {
      let centerX = (this.centerXAtPress + clientX - this.mouseXAtPress) / this.props.parentWidth;
      let centerY = (this.centerYAtPress + clientY - this.mouseYAtPress) / this.props.parentHeight;

      if (centerX + this.props.circle.radius > 1) {
        centerX = 1 - this.props.circle.radius;
      } else if (centerX - this.props.circle.radius < 0) {
        centerX = this.props.circle.radius;
      }
      if (centerY + this.props.circle.radius > 1) {
        centerY = 1 - this.props.circle.radius;
      } else if (centerY - this.props.circle.radius < 0) {
        centerY = this.props.circle.radius;
      }
      this.props.onChange({ ...this.props.circle, centerX, centerY });
    }
  }

  onMouseUp = event => this.endDrag();

  endDrag = () => {
    if (this.dragOccurred) {
      this.toggleDragStyles();
      this.dragOccurred = false;
    }
    const anyDragAttempted = this.strokeDragInProgress || this.fillDragInProgress;
    if (this.strokeDragInProgress) {
      this.strokeDragInProgress = false;
    }
    if (this.fillDragInProgress) {
      this.fillDragInProgress = false;
    }
    if (anyDragAttempted && this.didValuesChange()) {
      this.props.onRelease(this.props.circle);
    }
  }

  didValuesChange = () => this.props.circle.centerX !== this.circleAtPress.centerX
    || this.props.circle.centerY !== this.circleAtPress.centerY
    || this.props.circle.radius !== this.circleAtPress.radius;

  getAnnotationLayerClassList = () => this.root.parentElement.classList;

  toggleDragStyles = () => {
    if (this.strokeDragInProgress) {
      this.circle.classList.toggle('dragged');
      this.getAnnotationLayerClassList().toggle('circle-stroke-dragged');
    }
    if (this.fillDragInProgress) {
      this.circle.classList.toggle('dragged');
      this.getAnnotationLayerClassList().toggle('circle-fill-dragged');
    }
    this.getAnnotationLayerClassList().toggle('any-dragged');
  }

  onDeleteButtonClick = () => this.props.onDeleteButtonClick(this.props.circle);
}

export default CircleMeasurement;