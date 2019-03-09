import fetch from "isomorphic-fetch";
import { API_TRACK } from "common/constants/urls";

const TRACK_REQUESTED = "track/TRACK_REQUESTED";
const TRACK_RECEIVED = "track/TRACK_RECEIVED";
const TRACK_ERRORED = "track/TRACK_ERRORED";

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
  return dispatch => {
    dispatch(requestTrack());
    return fetch(API_TRACK, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(track => {
        dispatch(receiveTrack(track));
      })
      .catch(e => {
        dispatch(handleTrackError(e));
        console.warn(e);
      });
  };
};

export { TRACK_REQUESTED, TRACK_RECEIVED, TRACK_ERRORED, fetchTrack };
