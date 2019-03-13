import {
  TRACK_REQUESTED,
  TRACK_RECEIVED,
  TRACK_ERRORED,
  SET_SPOTIFY_TOKENS,
  REFRESH_SPOTIFY_TOKEN
} from "actions/spotify";

const initialTrackState = {
  track: null,
  fetching: false,
  error: false
};

const track = (state = initialTrackState, action) => {
  switch (action.type) {
    case TRACK_REQUESTED:
      return {
        ...state,
        fetching: true
      };

    case TRACK_RECEIVED:
      return {
        ...state,
        track: action.payload.track,
        fetching: false,
        error: false
      };
    case TRACK_ERRORED:
      return {
        ...state,
        track: null,
        fetching: false,
        error: true
      };
    default:
      return state;
  }
};

const spotifyTokens = (state = null, action) => {
  switch (action.type) {
    case REFRESH_SPOTIFY_TOKEN:
    case SET_SPOTIFY_TOKENS:
      return action.payload.spotifyTokens;
    default:
      return state;
  }
};

export { track, spotifyTokens };
