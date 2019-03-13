import {
  getCurrentlyPlayingSpotifyTrack,
  getRefreshedSpotifyAccessToken
} from "api/api";

const SET_SPOTIFY_TOKENS = "spotify/SET_SPOTIFY_TOKENS";
const REFRESH_SPOTIFY_TOKEN = "spotify/REFRESH_SPOTIFY_TOKEN";
const TRACK_REQUESTED = "spotify/TRACK_REQUESTED";
const TRACK_RECEIVED = "spotify/TRACK_RECEIVED";
const TRACK_ERRORED = "spotify/TRACK_ERRORED";

const requestTrack = () => ({
  type: TRACK_REQUESTED
});

const receiveTrack = track => ({
  type: TRACK_RECEIVED,
  payload: { track }
});

const handleTrackError = error => ({
  type: TRACK_ERRORED,
  payload: { error }
});

const fetchTrack = () => {
  return async (dispatch, getState) => {
    try {
      const { spotifyTokens } = getState();
      if (!spotifyTokens) {
        return;
      }
      dispatch(requestTrack());
      let track = await getCurrentlyPlayingSpotifyTrack(
        spotifyTokens.spotifyAccessToken
      );
      dispatch(receiveTrack(track.item));
    } catch (e) {
      dispatch(handleTrackError(e));
      console.warn(e);
    }
  };
};

const receiveAccessToken = spotifyTokens => ({
  type: REFRESH_SPOTIFY_TOKEN,
  payload: { spotifyTokens }
});

const refreshSpotifyToken = () => {
  return async (dispatch, getState) => {
    try {
      const { spotifyTokens } = getState();
      if (!spotifyTokens) {
        return;
      }
      let { spotifyAccessToken } = await getRefreshedSpotifyAccessToken(
        spotifyTokens.spotifyRefreshToken
      );
      dispatch(
        receiveAccessToken({
          ...spotifyTokens,
          spotifyAccessToken
        })
      );
    } catch (e) {
      console.warn(e);
    }
  };
};

const setSpotifyTokens = spotifyTokens => {
  return dispatch => {
    dispatch({
      type: SET_SPOTIFY_TOKENS,
      payload: { spotifyTokens }
    });
  };
};

export {
  TRACK_REQUESTED,
  TRACK_RECEIVED,
  TRACK_ERRORED,
  SET_SPOTIFY_TOKENS,
  REFRESH_SPOTIFY_TOKEN,
  fetchTrack,
  setSpotifyTokens,
  refreshSpotifyToken
};
