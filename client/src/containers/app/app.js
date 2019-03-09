import React from "react";
import PropTypes from "prop-types";
import AlbumContainer from "containers/AlbumContainer";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchTrack } from "actions/spotify";
import { withStyles } from "@material-ui/core/styles";
import "./app.scss";

const styles = {
  root: {
    backgroundColor: "white"
  }
};

class App extends React.Component {
  componentDidMount() {
    const { fetchTrack } = this.props;
    fetchTrack();
    setInterval(fetchTrack, 3000);
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={`App ${classes.root}`}>
        <AlbumContainer />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  track: state.track
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTrack
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
