import React, { PureComponent } from "react";
import MeasuredImage from "./MeasuredImage";
import "./MeasurementApp.css";

export default class MeasurementApp extends PureComponent {
  state = { loaded: false };

  render() {
    return (
      <div className="container">
        <div className="title-bar">
          <div className="title-bar-inner">
            <span className="title-text">React Measurements</span>
            <div className="splitter" />
            <a href="https://www.npmjs.com/package/react-measurements">
              v0.6.8
            </a>
            <a href="https://github.com/rmfisher/react-measurements">GitHub</a>
          </div>
          <div className="mobile-readonly-message">
            A mouse is required for editing, sorry!
          </div>
        </div>
        <div className="content">
          <div
            className={
              "measurements-body" + (this.state.loaded ? " loaded" : "")
            }
          >
            <div>
              <MeasuredImage onImageLoaded={this.onImageLoaded} />
            </div>
            <p>Fig. 1: Pollen grains under an electron microscope.</p>
          </div>
        </div>
      </div>
    );
  }

  onImageLoaded = () => this.setState({ ...this.state, loaded: true });
}
