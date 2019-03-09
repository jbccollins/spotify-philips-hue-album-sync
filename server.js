import express from 'express';
import path from 'path';
import fs from 'fs';
import fetch from 'isomorphic-fetch';
import chalk from 'chalk';
import {
  API_TRACK,
} from './common/constants/urls';

const app = express();
const port = process.env.PORT || 5001;

let currentTrackID = null;
let currentTrackData = null;

function handleErrors(response) {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  return response;
}

const TOKEN = `
BQASCKM-ySVvdIkBv-jLpRQk36nOCcWw9HM8MLLJpfKmXl2be_SJebBagNnazzuHIueUdlDqCw7fHZWoEh-gcfd72PMfXV6rwk4yhDyqdg-YZmiuABcmZHVD-XlkSZZxSifCwyVzKo3b3NFbVwdBXg
`;

const fetchSpotifyTrackData = () => {
  fetch(`https://api.spotify.com/v1/tracks/${currentTrackID}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${TOKEN.trim()}`,
      //'Content-Type': 'application/json'
    }
  }).then(handleErrors)
  .then(response => response.json())
  .then(json => currentTrackData = json)
  //.catch(error => console.log(error) );
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
setInterval(readSpotifyTrackID, 2000);

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static(__dirname + '/client/build'));

app.get(API_TRACK, (req, res) => {
  res.send(currentTrackData);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});