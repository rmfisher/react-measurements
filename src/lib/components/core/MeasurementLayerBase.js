import React, { PureComponent } from 'react';
import LineMeasurement from './LineMeasurement';
import CircleMeasurement from './CircleMeasurement';
import TextAnnotation from './TextAnnotation';
import PropTypes from 'prop-types';
import './MeasurementLayerBase.css';

const minRadiusInPixels = 3;

class MeasurementLayerBase extends PureComponent {

  componentDidMount() {
    this.root.addEventListener('mousedown', this.onMouseDown);
    this.root.addEventListener('click', this.onClick);
    document.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('blur', this.endDrag);
  }

  componentWillUnmount() {
    this.root.removeEventListener('mousedown', this.onMouseDown);
    this.root.removeEventListener('click', this.onClick);
    document.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('blur', this.endDrag);
  }

  render() {
    const className = 'measurement-layer-base' + (this.props.mode ? ' any-mode-on' : '');
    return (
      <div className={className} ref={e => this.root = e}>
        {this.props.measurements.map(this.createMeasurementComponent)}
      </div>
    );
  }

  createMeasurementComponent = measurement => {
    if (measurement.type === 'line') {
      return (
        <LineMeasurement
          key={measurement.id}
          line={measurement}
          parentWidth={this.props.width}
          parentHeight={this.props.height}
          measureLine={this.props.measureLine}
          formatDistance={this.props.formatDistance}
          onChange={this.onChange}
          onRelease={this.props.onRelease}
          onDeleteButtonClick={this.delete}
        />
      );
    } else if (measurement.type === 'circle') {
      return (
        <CircleMeasurement
          key={measurement.id}
          circle={measurement}
          parentWidth={this.props.width}
          parentHeight={this.props.height}
          measureCircle={this.props.measureCircle}
          formatArea={this.props.formatArea}
          onChange={this.onChange}
          onRelease={this.props.onRelease}
          onDeleteButtonClick={this.delete}
        />
      );
    } else if (measurement.type === 'text') {
      return (
        <TextAnnotation
          key={measurement.id}
          text={measurement}
          parentWidth={this.props.width}
          parentHeight={this.props.height}
          onChange={this.onChange}
          onRelease={this.props.onRelease}
          onDeleteButtonClick={this.delete}
        />
      );
    } else {
      return false;
    }
  }

  onMouseDown = event => {
    this.finishAnyTextEditing();
    if (event.button === 0) {
      event.preventDefault();
      if (this.props.mode === 'line') {
        this.lineCreationInProgress = true;
        this.mouseXAtPress = event.clientX;
        this.mouseYAtPress = event.clientY;
      } else if (this.props.mode === 'circle') {
        this.circleCreationInProgress = true;
        this.mouseXAtPress = event.clientX;
        this.mouseYAtPress = event.clientY;
      }
    }
  }

  onMouseMove = event => {
    if (this.lineCreationInProgress) {
      const rect = this.root.getBoundingClientRect();
      const endX = this.clamp((event.clientX - rect.left) / this.props.width);
      const endY = this.clamp((event.clientY - rect.top) / this.props.height);
      if (this.createdId === null) {
        this.createdId = this.getNextId();
        const startX = this.clamp((this.mouseXAtPress - rect.left) / this.props.width);
        const startY = this.clamp((this.mouseYAtPress - rect.top) / this.props.height);
        const line = { id: this.createdId, type: 'line', startX, startY, endX, endY };
        this.root.classList.add('line-end-dragged');
        this.props.onChange([...this.props.measurements, line]);
      } else {
        const line = this.props.measurements.filter(a => a.id === this.createdId)[0];
        this.onChange({ ...line, endX, endY });
      }
    } else if (this.circleCreationInProgress) {
      const rect = this.root.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;
      if (this.createdId === null) {
        this.createdId = this.getNextId();
        const centerX = this.clamp((this.mouseXAtPress - rect.left) / this.props.width);
        const centerY = this.clamp((this.mouseYAtPress - rect.top) / this.props.height);
        const radius = this.calculateRadius(cursorX, cursorY, centerX, centerY);
        const circle = { id: this.createdId, type: 'circle', centerX, centerY, radius };
        this.root.classList.add('circle-stroke-dragged');
        this.props.onChange([...this.props.measurements, circle]);
      } else {
        const circle = this.props.measurements.filter(a => a.id === this.createdId)[0];
        const radius = this.calculateRadius(cursorX, cursorY, circle.centerX, circle.centerY);
        this.onChange({ ...circle, radius });
      }
    }
  }

  calculateRadius = (cursorX, cursorY, centerX, centerY) => {
    const deltaX = cursorX - centerX * this.props.width;
    const deltaY = cursorY - centerY * this.props.height;
    let radius = Math.max(Math.hypot(deltaX, deltaY), minRadiusInPixels) / Math.sqrt(this.props.width * this.props.height);

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
  }

  onMouseUp = event => this.endDrag();

  endDrag = () => {
    if (this.lineCreationInProgress) {
      this.lineCreationInProgress = false;
      if (this.createdId !== null) {
        this.root.classList.remove('line-end-dragged');
      }
    } else if (this.circleCreationInProgress) {
      this.circleCreationInProgress = false;
      if (this.createdId !== null) {
        this.root.classList.remove('circle-stroke-dragged');
      }
    }
    if (this.createdId !== null) {
      this.props.onRelease(this.props.measurements.filter(a => a.id === this.createdId)[0]);
      this.createdId = null;
    }
  }

  onClick = event => {
    if (this.props.mode === 'text') {
      const id = this.getNextId();
      const rect = this.root.getBoundingClientRect();
      const arrowX = (event.clientX - rect.left) / this.props.width;
      const arrowY = (event.clientY - rect.top) / this.props.height;
      const xOffsetDirection = arrowX < 0.8 ? 1 : -1;
      const yOffsetDirection = arrowY < 0.8 ? 1 : -1;
      const textX = arrowX + xOffsetDirection * 0.05;
      const textY = arrowY + yOffsetDirection * 0.07;
      const text = { id, type: 'text', arrowX, arrowY, textX, textY, editorState: null, editable: true };
      this.props.onChange([...this.props.measurements, text]);
      this.props.onRelease(this.props.measurements.filter(a => a.id === this.createdId)[0]);
    }
  }

  getNextId = () => this.props.measurements.length > 0 ? (Math.max(...this.props.measurements.map(a => a.id)) + 1) : 0;

  onChange = m => this.props.onChange(this.props.measurements.map(n => m.id === n.id ? m : n));

  delete = m => this.props.onChange(this.props.measurements.filter(n => n.id !== m.id));

  clamp = value => Math.min(1, Math.max(0, value));

  finishAnyTextEditing = () => {
    const editable = this.props.measurements.filter(m => m.type === 'text' && m.editable)[0];
    if (editable) {
      this.props.onChange(this.props.measurements.map(m => m === editable ? { ...m, editable: false } : m));
    }
  }
}

MeasurementLayerBase.propTypes = {
  // Required:
  measurements: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  measureLine: PropTypes.func.isRequired,
  measureCircle: PropTypes.func.isRequired,
  formatDistance: PropTypes.func.isRequired,
  formatArea: PropTypes.func.isRequired,

  // Optional:
  mode: PropTypes.string,
  onRelease: PropTypes.func,
};

export default MeasurementLayerBase;