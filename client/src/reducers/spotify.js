import {
  TRACK_REQUESTED,
  TRACK_RECEIVED,
  TRACK_ERRORED
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
        track: [],
        fetching: false,
        error: true
      };
    default:
      return state;
  }
};

export { track };
