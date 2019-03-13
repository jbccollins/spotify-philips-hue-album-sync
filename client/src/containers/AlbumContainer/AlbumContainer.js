import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  rgbToCie,
  getLuminosity,
  luminosityDistanceSort
} from "utilities/colorConverter";
import { fetchTrack, refreshSpotifyToken } from "actions/spotify";
import ColorThief from "color-thief";
import { requestSetLamp, getLampUrl } from "actions/philipshue";
import "./AlbumContainer.scss";

const colorThief = new ColorThief();
const numberOfColors = 4;
const lampIds = [1, 2, 3, 4];
function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

const lightSvg = () => {
  return (
    <svg>
      <path d="M19,1 Q21,0,23,1 L39,10 Q41.5,11,42,14 L42,36 Q41.5,39,39,40 L23,49 Q21,50,19,49 L3,40 Q0.5,39,0,36 L0,14 Q0.5,11,3,10 L19,1" />
      <circle cx="21" cy="25" r="8" />
      <circle cx="21" cy="25" r="12" />
    </svg>
  );
};

class AlbumContainer extends React.Component {
  state = {
    albumImageUrl: null,
    colors: null,
    luminosityOrder: null,
    lamp1Interval: null,
    lamp2Interval: null,
    lamp3Interval: null,
    lamp4Interval: null
  };

  componentDidMount() {
    const { fetchTrack, refreshSpotifyToken } = this.props;
    fetchTrack();
    setInterval(fetchTrack, 3000);
    // Refresh the access token at more than once an hour
    setInterval(refreshSpotifyToken, 3500000);
  }

  setLamp = async (x, y, lightNumber) => {
    const myX = Number(x);
    const myY = Number(y);
    const lampUrl = getLampUrl(lightNumber);
    const lampData = { on: true, sat: 254, bri: 254, xy: [myX, myY] };
    await requestSetLamp(lampData, lampUrl);
  };

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

  handleImageLoad = async () => {
    const {
      lamp1Interval,
      lamp2Interval,
      lamp3Interval,
      lamp4Interval
    } = this.state;
    clearInterval(lamp1Interval);
    clearInterval(lamp2Interval);
    clearInterval(lamp3Interval);
    clearInterval(lamp4Interval);
    let colors = [];
    for (let i = 0; i < numberOfColors; i++) {
      const [r, g, b] = this.getRgb(i);
      const [x, y] = rgbToCie(r, g, b);
      const luminosity = getLuminosity(r, g, b);
      colors.push({
        index: i,
        luminosity,
        r,
        g,
        b,
        x,
        y
      });
    }

    // clone colors for in place sort
    const luminositySortedColors = luminosityDistanceSort(colors.map(c => c));
    const luminosityOrder = luminositySortedColors.map(({ index }) => index);

    const INTERVAL_AMOUNT = 20000;
    const lamp1Func = async () => {
      await this.setLamp(
        colors[luminosityOrder[0]].x,
        colors[luminosityOrder[0]].y,
        lampIds[0]
      );
    };
    const lamp2Func = async () => {
      await this.setLamp(
        colors[luminosityOrder[1]].x,
        colors[luminosityOrder[1]].y,
        lampIds[1]
      );
    };
    const lamp3Func = async () => {
      await this.setLamp(
        colors[luminosityOrder[2]].x,
        colors[luminosityOrder[2]].y,
        lampIds[2]
      );
    };
    const lamp4Func = async () => {
      await this.setLamp(
        colors[luminosityOrder[3]].x,
        colors[luminosityOrder[3]].y,
        lampIds[3]
      );
    };
    let newLamp1Interval = null;
    let newLamp2Interval = null;
    let newLamp3Interval = null;
    let newLamp4Interval = null;

    if (lampIds.length > 0) {
      await lamp1Func();
      newLamp1Interval = setInterval(lamp1Func, INTERVAL_AMOUNT);
    }
    if (lampIds.length > 1) {
      setTimeout(lamp2Func, 250);
      newLamp2Interval = setInterval(lamp2Func, INTERVAL_AMOUNT + 1000);
    }
    if (lampIds.length > 2) {
      setTimeout(lamp3Func, 500);
      newLamp3Interval = setInterval(lamp3Func, INTERVAL_AMOUNT + 2000);
    }
    if (lampIds.length > 3) {
      setTimeout(lamp4Func, 750);
      newLamp4Interval = setInterval(lamp4Func, INTERVAL_AMOUNT + 3000);
    }
    this.setState({
      lamp1Interval: newLamp1Interval,
      lamp2Interval: newLamp2Interval,
      lamp3Interval: newLamp3Interval,
      lamp4Interval: newLamp4Interval,
      colors,
      luminosityOrder
    });
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
      if (url !== prevState.albumImageUrl) {
        return { albumImageUrl: url };
      }
    }
    return prevState;
  }

  render() {
    const { track } = this.props;
    const { albumImageUrl, colors, luminosityOrder } = this.state;
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
      <div
        className="AlbumContainer"
        style={backgroundStyle}
        ref={r => (this.containerRef = r)}
      >
        <div className="space stars1" style={space1BackgroundStyle} />
        <div className="space stars2" style={space2BackgroundStyle} />
        <div className="space stars3" style={space3BackgroundStyle} />
        <div className="space stars4" style={space4BackgroundStyle} />
        <div className="content-wrapper">
          {!track && (
            <div className="no-track">
              Looks like you aren't currently playing anything on Spotify. Start
              playing a song and this page will become pretty :)
            </div>
          )}
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
                alt="album art"
                ref={r => (this.img = r)}
                crossOrigin="anonymous"
                onLoad={this.handleImageLoad}
                src={albumImageUrl}
              />
            </div>
          )}
          {colors && (
            <div className="colors-container">
              {colors.map(color => {
                const luminosityIndex = luminosityOrder.indexOf(color.index);
                let isActiveLamp = false;
                let lampIconClass = "white";
                if (luminosityIndex < lampIds.length && lampIds.length < 4) {
                  isActiveLamp = true;
                  if (this.invertColor(color, true) === "#000000") {
                    lampIconClass = "black";
                  }
                }
                return (
                  <div
                    key={color.index}
                    className={`color-square${
                      isActiveLamp ? ` active-lamp ${lampIconClass}` : ""
                    }`}
                    style={{ backgroundColor: this.rgbToCssString(color, 1) }}
                  >
                    {isActiveLamp && lightSvg()}
                  </div>
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTrack,
      refreshSpotifyToken
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumContainer);
