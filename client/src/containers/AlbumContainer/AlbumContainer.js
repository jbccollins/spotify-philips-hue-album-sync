import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { cie_to_rgb, rgb_to_cie } from "utilities/colorConverter";
import ColorThief from "color-thief";
import { requestSetLamp, getLampUrl } from "actions/philipshue";
import "./AlbumContainer.scss";

const colorThief = new ColorThief();
const numberOfColors = 4;
function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

class AlbumContainer extends React.Component {
  state = {
    albumImageUrl: null,
    colors: null
  };

  setLamp(x, y, lightNumber) {
    console.log("SET LAMP");
    const myX = Number(x);
    const myY = Number(y);
    const lampUrl = getLampUrl(lightNumber);
    const lampData = { on: true, sat: 254, bri: 254, xy: [myX, myY] };
    requestSetLamp(lampData, lampUrl);
  }

  rgbToCssString = ({ r, g, b }, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

  invertColor = ({ r, g, b }, bw) => {
    if (bw) {
      // http://stackoverflow.com/a/3943023/112731
      return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
  };

  getRgb = colorIndex => {
    const r = colorThief.getPalette(this.img, numberOfColors)[colorIndex][0];
    const g = colorThief.getPalette(this.img, numberOfColors)[colorIndex][1];
    const b = colorThief.getPalette(this.img, numberOfColors)[colorIndex][2];
    return [r, g, b];
  };

  handleImageLoad = () => {
    const colors = [];
    for (let i = 0; i < numberOfColors; i++) {
      const [r, g, b] = this.getRgb(i);
      const [x, y] = rgb_to_cie(r, g, b);
      colors.push({
        r,
        g,
        b,
        x,
        y
      });
    }
    this.setState({ colors });
    this.setLamp(colors[0].x, colors[0].y, 1);
    this.setLamp(colors[1].x, colors[1].y, 4);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { track } = nextProps;
    if (
      track &&
      track.album &&
      track.album.images &&
      track.album.images.length > 2
    ) {
      const url = track.album.images[0].url;
      //console.log(url, prevState.albumImageUrl);
      if (url !== prevState.albumImageUrl) {
        console.log(url);
        return { albumImageUrl: url };
      }
    }
    return prevState;
  }

  render() {
    const { track } = this.props;
    const { albumImageUrl, colors } = this.state;
    console.log(colors);
    let backgroundStyle = {};
    let space1BackgroundStyle = {};
    let space2BackgroundStyle = {};
    let space3BackgroundStyle = {};
    let space4BackgroundStyle = {};
    let trackColor = "black";
    if (colors) {
      backgroundStyle = {
        background: `
          radial-gradient(
            circle at bottom,
            ${this.rgbToCssString(colors[1], 1)} 0,
            ${this.rgbToCssString(colors[0], 1)} 100%
          )
        `
      };
      trackColor = this.invertColor(colors[0], true);
      space1BackgroundStyle = {
        background: `${this.rgbToCssString(
          colors[0],
          0.1
        )} center / 200px 200px round`
      };
      space2BackgroundStyle = {
        background: `${this.rgbToCssString(
          colors[1],
          0.1
        )} center / 200px 200px round`
      };
      space3BackgroundStyle = {
        background: `${this.rgbToCssString(
          colors[2],
          0.1
        )} center / 200px 200px round`
      };
      space4BackgroundStyle = {
        background: `${this.rgbToCssString(
          colors[3],
          0.1
        )} center / 200px 200px round`
      };
    }
    return (
      <div className="AlbumContainer" style={backgroundStyle}>
        <div className="space stars1" style={space1BackgroundStyle} />
        <div className="space stars2" style={space2BackgroundStyle} />
        <div className="space stars3" style={space3BackgroundStyle} />
        <div className="space stars4" style={space4BackgroundStyle} />
        <div className="content-wrapper">
          <div className="track-info" style={{ color: trackColor }}>
            {track && <div className="track-name">{track.name}</div>}
            {track && track.artists && (
              <div className="artist-name">{track.artists[0].name}</div>
            )}
            {track && track.album && (
              <div className="album-name">{track.album.name}</div>
            )}
          </div>
          {albumImageUrl && (
            <div className="album-wrapper">
              <img
                ref={r => (this.img = r)}
                crossOrigin="anonymous"
                onLoad={this.handleImageLoad}
                src={albumImageUrl}
              />
            </div>
          )}
          {colors && (
            <div className="colors-container">
              {colors.map((color, i) => {
                return (
                  <div
                    key={Math.random()}
                    className="color-square"
                    style={{ backgroundColor: this.rgbToCssString(color, 1) }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

AlbumContainer.propTypes = {
  track: PropTypes.object
};

const mapStateToProps = state => ({
  track: state.track.track
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumContainer);
