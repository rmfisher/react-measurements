import React, { PureComponent } from 'react';
import { Editor, EditorState } from 'draft-js';
import TextAnchor from './TextAnchor';

const headWidth = 8;
const headHeight = 5;
const headHoverWidth = 10;
const headHoverHeight = 6;
const headHoverOffset = 1.5;
const headGrabberWidth = 15;
const headGrabberHeight = 9;
const headGrabberOffset = 3;

class TextAnnotation extends PureComponent {

  constructor(props) {
    super(props);
    this.propagateTextChanges = false;
    this.state = { lineHover: false, headHover: false, lineDragged: false, headDragged: false, textDragged: false };
  }

  componentDidMount() {
    this.text.addEventListener('mousedown', this.onTextDown);
    this.lineGrabber.addEventListener('mousedown', this.onLineDown);
    this.lineGrabber.addEventListener('mouseenter', this.onLineEnter);
    this.lineGrabber.addEventListener('mouseleave', this.onLineLeave);
    this.headGrabber.addEventListener('mousedown', this.onHeadDown);
    this.headGrabber.addEventListener('mouseenter', this.onHeadEnter);
    this.headGrabber.addEventListener('mouseleave', this.onHeadLeave);
    this.root.addEventListener('dblclick', this.onDoubleClick);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('keydown', this.onDocumentKeyDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('blur', this.endDrag);
    this.updateMask();

    if (this.props.text.editable) {
      this.propagateTextChanges = true;
      this.editor.focus();
    }
  }

  componentWillUnmount() {
    this.text.removeEventListener('mousedown', this.onTextDown);
    this.lineGrabber.removeEventListener('mousedown', this.onLineDown);
    this.lineGrabber.removeEventListener('mouseenter', this.onLineEnter);
    this.lineGrabber.removeEventListener('mouseleave', this.onLineLeave);
    this.headGrabber.removeEventListener('mousedown', this.onHeadDown);
    this.headGrabber.removeEventListener('mouseenter', this.onHeadEnter);
    this.headGrabber.removeEventListener('mouseleave', this.onHeadLeave);
    this.root.removeEventListener('dblclick', this.onDoubleClick);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('keydown', this.onDocumentKeyDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('blur', this.endDrag);
  }

  componentDidUpdate() {
    this.updateMask();
    if (!this.props.text.editable) {
      this.propagateTextChanges = false;
    }
  }

  render() {
    const pointX = this.props.text.arrowX * this.props.parentWidth;
    const pointY = this.props.text.arrowY * this.props.parentHeight;
    const textX = this.props.text.textX * this.props.parentWidth;
    const textY = this.props.text.textY * this.props.parentHeight;
    const rotate = Math.atan2(pointX - textX, textY - pointY) - Math.PI / 2;
    const cos = Math.cos(rotate);
    const sin = Math.sin(rotate);

    const lineEndX = pointX - (headWidth - 1) * cos;
    const lineEndY = pointY - (headWidth - 1) * sin;
    const lineClass = 'arrow-line' + (this.state.lineHover ? ' hover' : '') + (this.state.lineDragged ? ' dragged' : '');
    // Extra 'M -1 -1' is a workaround for a chrome bug where the line dissapears if straight, even if outside the mask's clip area:
    const linePath = `M -1 -1 M ${textX} ${textY} L ${lineEndX} ${lineEndY}`;

    const showLargerHead = this.state.lineHover || this.state.headHover || this.state.lineDragged || this.state.headDragged;
    const headGrabber = this.drawHead(pointX, pointY, headGrabberWidth, headGrabberHeight, rotate, headGrabberOffset, cos, sin);
    const head = showLargerHead ? this.drawHead(pointX, pointY, headHoverWidth, headHoverHeight, rotate, headHoverOffset, cos, sin)
      : this.drawHead(pointX, pointY, headWidth, headHeight, rotate, 0, 0, 0);

    const editorState = this.props.text.editorState;
    const hasText = editorState != null && editorState.getCurrentContent() != null && editorState.getCurrentContent().hasText();
    const textVisible = hasText || this.props.text.editable;
    const rootClass = 'text-annotation'
      + (!hasText ? ' no-text' : '')
      + (this.props.text.editable ? ' editable' : '');

    const lineMaskId = `lineMask${this.props.text.id}`;
    const lineMask = textVisible ? 'url(#' + lineMaskId + ')' : '';

    return (
      <div className={rootClass} ref={e => this.root = e}>
        <svg className='measurement-svg'>
          <defs>
            <mask id={lineMaskId}>
              <rect x='0' y='0' width='100%' height='100%' fill='white' />
              <rect fill='black' ref={e => this.maskRect = e} />
            </mask>
          </defs>
          <line className='arrow-line-grabber' x1={lineEndX} y1={lineEndY} x2={textX} y2={textY} ref={e => this.lineGrabber = e} />
          <path className='arrow-head-grabber' d={headGrabber.path} transform={headGrabber.transform} ref={e => this.headGrabber = e} />
          <path className='arrow-head' d={head.path} transform={head.transform} ref={e => this.head = e} />
          <path className={lineClass} d={linePath} ref={e => this.line = e} mask={lineMask} />
        </svg>
        <TextAnchor x={textX} y={textY} onDeleteButtonClick={this.onDeleteButtonClick}>
          <div className='text' ref={e => this.text = e}>
            <Editor
              editorState={editorState ? editorState : EditorState.createEmpty()}
              readOnly={!this.props.text.editable}
              onChange={this.onTextChange}
              onBlur={this.finishEdit}
              ref={e => this.editor = e} />
          </div>
        </TextAnchor>
      </div>
    );
  }

  drawHead = (pointX, pointY, w, h, rotate, offset, cos, sin) => {
    const x = pointX + offset * cos;
    const y = pointY + offset * sin;
    const path = `M ${x - w} ${y - h} L ${x} ${y} L ${x - w} ${y + h} Z`;
    const rotateInDegrees = rotate * 180 / Math.PI;
    const transform = `rotate(${rotateInDegrees} ${x} ${y})`;
    return { path, transform };
  }

  updateMask = () => {
    const rootBox = this.root.getBoundingClientRect();
    const textBox = this.text.getBoundingClientRect();

    this.maskRect.setAttribute('x', textBox.left - rootBox.left);
    this.maskRect.setAttribute('y', textBox.top - rootBox.top);
    this.maskRect.setAttribute('width', textBox.width);
    this.maskRect.setAttribute('height', textBox.height);
  }

  onTextDown = event => {
    if (this.props.text.editable) {
      event.stopPropagation();
    } else if (event.button === 0) {
      this.textDragInProgress = true;
      this.onDragBegin(event);
    }
  }

  onLineDown = event => {
    if (event.button === 0) {
      this.lineDragInProgress = true;
      this.onDragBegin(event);
      if (this.props.text.editable) {
        event.stopPropagation();
      }
    }
  }

  onHeadDown = event => {
    if (event.button === 0) {
      this.headDragInProgress = true;
      this.onDragBegin(event);
      if (this.props.text.editable) {
        event.stopPropagation();
      }
    }
  }

  onDragBegin = event => {
    event.preventDefault();
    this.mouseXAtPress = event.clientX;
    this.mouseYAtPress = event.clientY;
    this.arrowXAtPress = this.props.text.arrowX * this.props.parentWidth;
    this.arrowYAtPress = this.props.text.arrowY * this.props.parentHeight;
    this.textXAtPress = this.props.text.textX * this.props.parentWidth;
    this.textYAtPress = this.props.text.textY * this.props.parentHeight;
  }

  onMouseMove = event => {
    if ((this.textDragInProgress || this.lineDragInProgress || this.headDragInProgress) && this.props.text.editable) {
      this.finishEdit();
    }

    if ((this.textDragInProgress || this.lineDragInProgress || this.headDragInProgress) && !this.dragOccurred) {
      this.dragOccurred = true;
      this.toggleDragStyles();
    }

    const clientX = event.clientX;
    const clientY = event.clientY;
    if (this.headDragInProgress) {
      const arrowX = this.clamp(this.getXAfterDrag(this.arrowXAtPress, clientX));
      const arrowY = this.clamp(this.getYAfterDrag(this.arrowYAtPress, clientY));
      this.props.onChange({ ...this.props.text, arrowX, arrowY });
    } else if (this.textDragInProgress) {
      const textX = this.clamp(this.getXAfterDrag(this.textXAtPress, clientX));
      const textY = this.clamp(this.getYAfterDrag(this.textYAtPress, clientY));
      this.props.onChange({ ...this.props.text, textX, textY });
    } else if (this.lineDragInProgress) {
      let arrowX = this.getXAfterDrag(this.arrowXAtPress, clientX);
      let arrowY = this.getYAfterDrag(this.arrowYAtPress, clientY);
      let textX = this.getXAfterDrag(this.textXAtPress, clientX);
      let textY = this.getYAfterDrag(this.textYAtPress, clientY);
      const deltaX = textX - arrowX;
      const deltaY = textY - arrowY;

      if (arrowX < 0) {
        arrowX = 0;
        textX = deltaX;
      } else if (arrowX > 1) {
        arrowX = 1;
        textX = 1 + deltaX;
      }
      if (arrowY < 0) {
        arrowY = 0;
        textY = deltaY;
      } else if (arrowY > 1) {
        arrowY = 1;
        textY = 1 + deltaY;
      }
      if (textX < 0) {
        arrowX = -deltaX;
        textX = 0;
      } else if (textX > 1) {
        arrowX = 1 - deltaX;
        textX = 1;
      }
      if (textY < 0) {
        arrowY = -deltaY;
        textY = 0;
      } else if (textY > 1) {
        arrowY = 1 - deltaY;
        textY = 1;
      }
      this.props.onChange({ ...this.props.text, arrowX, arrowY, textX, textY });
    }
  }

  getXAfterDrag = (xAtPress, clientX) => (xAtPress + clientX - this.mouseXAtPress) / this.props.parentWidth;

  getYAfterDrag = (yAtPress, clientY) => (yAtPress + clientY - this.mouseYAtPress) / this.props.parentHeight;

  onMouseUp = event => this.endDrag();

  endDrag = () => {
    if (this.dragOccurred) {
      this.toggleDragStyles();
      this.dragOccurred = false;
    }

    const anyDragAttempted = this.textDragInProgress || this.lineDragInProgress || this.headDragInProgress;
    if (this.textDragInProgress) {
      this.textDragInProgress = false;
    }
    if (this.lineDragInProgress) {
      this.lineDragInProgress = false;
    }
    if (this.headDragInProgress) {
      this.headDragInProgress = false;
    }
    if (anyDragAttempted && this.didValuesChange()) {
      this.props.onRelease(this.props.text);
    }
  }

  didValuesChange = () => true;

  toggleDragStyles = () => {
    this.getAnnotationLayerClassList().toggle('any-dragged');
    if (this.textDragInProgress) {
      this.getAnnotationLayerClassList().toggle('text-dragged');
      this.setState({ ...this.state, textDragged: !this.state.textDragged });
    } else if (this.lineDragInProgress) {
      this.getAnnotationLayerClassList().toggle('arrow-line-dragged');
      this.setState({ ...this.state, lineDragged: !this.state.lineDragged });
    } else if (this.headDragInProgress) {
      this.getAnnotationLayerClassList().toggle('arrow-head-dragged');
      this.setState({ ...this.state, headDragged: !this.state.headDragged });
    }
  }

  onLineEnter = event => this.setState({ ...this.state, lineHover: true });

  onLineLeave = event => this.setState({ ...this.state, lineHover: false });

  onHeadEnter = event => this.setState({ ...this.state, headHover: true });

  onHeadLeave = event => this.setState({ ...this.state, headHover: false });

  getAnnotationLayerClassList = () => this.root.parentElement.classList;

  clamp = value => Math.min(1, Math.max(0, value));

  onDoubleClick = event => {
    if (event.button === 0) {
      event.preventDefault();
      this.startEdit();
    }
  }

  onTextChange = editorState => {
    if (this.propagateTextChanges) {
      this.props.onChange({ ...this.props.text, editorState });
    }
  }

  startEdit = () => {
    if (!this.props.text.editable) {
      this.propagateTextChanges = true;
      const editorState = EditorState.moveSelectionToEnd(this.props.text.editorState);
      this.props.onChange({ ...this.props.text, editorState, editable: true });
      this.editor.focus();
    }
  }

  finishEdit = () => {
    if (this.props.text.editable) {
      this.propagateTextChanges = false;
      this.props.onChange({ ...this.props.text, editable: false });
    }
  }

  onDocumentKeyDown = event => {
    if (this.props.text.editable && event.keyCode === 27) {
      this.finishEdit();
    }
  }

  onDeleteButtonClick = () => this.props.onDeleteButtonClick(this.props.text);
}

export default TextAnnotation;