import React from "react";
import PropTypes from "prop-types";
import fetch from "isomorphic-fetch";
import { API_LOGIN } from "common/constants/urls";
import "./SpotifyRedirection.scss";

class SpotifyRedirection extends React.Component {
  async componentDidMount() {
    let res = await fetch(API_LOGIN, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });
    res = await res.json();
    if (res && res.spotifyUrl) {
      window.location = res.spotifyUrl;
    } else {
      alert("Failed to redirect to Spotify's authentication page");
    }
  }

  render() {
    return (
      <div className="SpotifyRedirection" onClick={this.props.onClick}>
        Redirecting to spotify login...
      </div>
    );
  }
}

SpotifyRedirection.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default SpotifyRedirection;
