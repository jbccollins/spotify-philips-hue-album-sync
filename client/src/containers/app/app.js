import React from "react";
import PropTypes from "prop-types";
import AlbumContainer from "containers/AlbumContainer";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import SpotifyRedirection from "components/SpotifyRedirection";
import SpotifyCallbackContainer from "containers/SpotifyCallbackContainer";
import { Route, Switch } from "react-router-dom";
import { CALLBACK } from "common/constants/urls";

import "./app.scss";

const styles = {
  root: {
    backgroundColor: "white"
  }
};

class App extends React.Component {
  render() {
    const { classes, spotifyTokens } = this.props;
    return (
      <div className={`App ${classes.root}`}>
        <Switch>
          {spotifyTokens && (
            <Route exact path="/app" component={AlbumContainer} />
          )}
          <Route path={CALLBACK} component={SpotifyCallbackContainer} />
          <Route exact path="/*" component={SpotifyRedirection} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  spotifyTokens: state.spotifyTokens
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
