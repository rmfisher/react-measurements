import React, { PureComponent } from 'react';

class TextAnchor extends PureComponent {

  constructor(props) {
    super(props);
    this.hover = false;
    this.state = { buttonShowing: false, justCreated: true };
  }

  componentDidMount() {
    this.mounted = true;
    this.textBox.addEventListener('mouseenter', this.onMouseEnter);
    this.textBox.addEventListener('mouseleave', this.onMouseLeave);
    this.deleteButton.addEventListener('mousedown', this.onDeleteButtonDown);

    setTimeout(() => {
      if (this.mounted) {
        this.setState({ ...this.state, justCreated: false })
      }
    }, 200);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.textBox.removeEventListener('mouseenter', this.onMouseEnter);
    this.textBox.removeEventListener('mouseleave', this.onMouseLeave);
    this.deleteButton.removeEventListener('mousedown', this.onDeleteButtonDown);
  }

  render() {
    const textAnchorStyle = { left: this.props.x + 'px', top: this.props.y + 'px' };
    if (this.props.rotate) {
      textAnchorStyle.transform = 'rotate(' + this.props.rotate + 'rad)';
    }

    const className = 'text-anchor'
      + (this.state.buttonShowing ? ' button-showing' : '')
      + (this.state.justCreated ? ' just-created' : '');

    return (
      <div className={className} style={textAnchorStyle}>
        <div className='text-box' ref={e => this.textBox = e}>
          {this.props.children}
          <div className='delete-button-box'>
            <svg className='delete-button' ref={e => this.deleteButton = e}>
              <rect className='delete-button-background' />
              <path className='delete-button-graphic' d='M 3 3 L 8 8 M 8 3 L 3 8' />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  onMouseEnter = event => {
    this.hover = true;
    setTimeout(() => {
      if (this.hover) {
        this.setState({ ...this.state, buttonShowing: true });
      }
    }, 500);
  }

  onMouseLeave = event => {
    this.hover = false;
    this.setState({ ...this.state, buttonShowing: false });
  }

  onDeleteButtonDown = event => {
    if (event.button === 0) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onDeleteButtonClick();
    }
  }
}

export default TextAnchor;