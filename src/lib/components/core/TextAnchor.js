import React, { PureComponent } from 'react';

class TextAnchor extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { buttonShowing: false, justCreated: true };
  }

  componentDidMount() {
    this.mounted = true;
    this.textBox.addEventListener('click', this.onClick);
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
          <button type='button' className='delete-button' ref={e => this.deleteButton = e}>
            <svg className='delete-button-svg'>
              <path className='delete-button-icon' d='M 4 4 L 11 11 M 11 4 L 4 11' />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  onClick = event => this.setState({ ...this.state, buttonShowing: true });

  onMouseLeave = event => this.setState({ ...this.state, buttonShowing: false });

  onDeleteButtonDown = event => {
    if (event.button === 0) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onDeleteButtonClick();
    }
  }
}

export default TextAnchor;