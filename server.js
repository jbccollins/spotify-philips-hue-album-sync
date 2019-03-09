import express from 'express';
import path from 'path';
import fs from 'fs';
import fetch from 'isomorphic-fetch';
import chalk from 'chalk';
import SpotifyWebApi from 'spotify-web-api-node';
import {
  API_TRACK,
} from './common/constants/urls';
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from './common/constants/authorization';

const app = express();
const port = process.env.PORT || 5001;

let currentTrackID = null;
let currentTrackData = null;

let spotifyAccessToken = null;

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000'
});

const setSpotifyAccessToken = async () => {
  const  data = await spotifyApi.clientCredentialsGrant();
  console.log('The access token expires in ' + data.body['expires_in']);
  console.log('The access token is ' + data.body['access_token']);

  // Save the access token so that it's used in future calls
  spotifyApi.setAccessToken(data.body['access_token']);
  spotifyAccessToken = spotifyApi.getAccessToken();  
}

const fetchSpotifyTrackData = async () => {
  try {
    if (!spotifyAccessToken) {
      await setSpotifyAccessToken();
    }
    const data = await spotifyApi.getTrack(currentTrackID);
    currentTrackData = data['body'];
  } catch (e) {
    console.log(e);
  }
}

const readSpotifyTrackID = (forceFetch) => {
  const contents = fs.readFileSync('songIdLog.txt', 'utf8');
  const [spotify, track, trackID] = contents.split(':');
  if (forceFetch || trackID !== currentTrackID) {
    currentTrackID = trackID;
    fetchSpotifyTrackData();
  }
}

readSpotifyTrackID(true);
// Read the track id every two seconds
setInterval(readSpotifyTrackID, 2000);
// Refresh the access token every minute.
setInterval(setSpotifyAccessToken, 60000);

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static(__dirname + '/client/build'));

app.get(API_TRACK, (req, res) => {
  res.send(currentTrackData);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});