import fetch from "isomorphic-fetch";
import {
  API_AUTHENTICATE,
  API_REFRESH_SPOTIFY_TOKEN,
  SPOTIFY_CURRENT_TRACK
} from "common/constants/urls";
const GET_PARAMS = {
  method: "GET",
  headers: {
    Accept: "application/json"
  }
};

const generateSpotifyGetParams = spotifyAccessToken => {
  const params = { ...GET_PARAMS };
  params.headers.Authorization = `Bearer ${spotifyAccessToken}`;
  return params;
};

const getSpotifyTokens = async code => {
  let res = await fetch(`${API_AUTHENTICATE}?code=${code}`, GET_PARAMS);
  res = await res.json();
  return res;
};

const getRefreshedSpotifyAccessToken = async spotifyRefreshToken => {
  let res = await fetch(
    `${API_REFRESH_SPOTIFY_TOKEN}?spotifyRefreshToken=${spotifyRefreshToken}`,
    GET_PARAMS
  );
  res = await res.json();
  return res;
};

const getCurrentlyPlayingSpotifyTrack = async spotifyAccessToken => {
  let track = await fetch(
    SPOTIFY_CURRENT_TRACK,
    generateSpotifyGetParams(spotifyAccessToken)
  );
  track = await track.json();
  return track;
};

export {
  getSpotifyTokens,
  getRefreshedSpotifyAccessToken,
  getCurrentlyPlayingSpotifyTrack
};
