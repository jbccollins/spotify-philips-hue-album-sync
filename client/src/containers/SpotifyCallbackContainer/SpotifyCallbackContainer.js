import React from "react";
import queryString from "query-string";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setSpotifyTokens } from "actions/spotify";
import { getSpotifyTokens } from "api/api";
import "./SpotifyCallbackContainer.scss";
import { Redirect } from "react-router-dom";
class SpotifyCallbackContainer extends React.Component {
  state = {
    hasTokens: false
  };

  async componentDidMount() {
    const queryParams = queryString.parse(window.location.search);
    // TODO: Handle case where code is null
    const { code } = queryParams;
    const tokens = await getSpotifyTokens(code);
    if (tokens.error) {
      // TODO: Handle token error
      alert("Something went wrong when authenticating with Spotify");
      return;
    }
    const { spotifyAccessToken, spotifyRefreshToken } = tokens;
    this.props.setSpotifyTokens({
      spotifyAccessToken,
      spotifyRefreshToken
    });
    this.setState({
      hasTokens: true
    });
  }
  render() {
    const { hasTokens } = this.state;
    return (
      <div className="SpotifyCallbackContainer">
        Finishing spotify authentication...
        {hasTokens && <Redirect to="/app" />}
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSpotifyTokens
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpotifyCallbackContainer);
