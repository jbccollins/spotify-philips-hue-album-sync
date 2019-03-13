import express from 'express';
import path from 'path';
import fs from 'fs';
import fetch from 'isomorphic-fetch';
import chalk from 'chalk';
import SpotifyWebApi from 'spotify-web-api-node';
import queryString from 'query-string';
var request = require('request');
var cookieParser = require('cookie-parser');
import {
  API_TRACK,
  API_LOGIN,
  API_AUTHENTICATE,
  SPOTIFY_AUTHORIZE,
  SPOTIFY_API_TOKEN,
  API_REFRESH_SPOTIFY_TOKEN,
} from './common/constants/urls';
import {
  SPOTIFY_CLIENT_ID,
  LOCAL_SPOTIFY_REDIRECT_URI,
  PRODUCTION_SPOTIFY_REDIRECT_URI,
} from './common/constants/authorization';

const SPOTIFY_REDIRECT_URI = process.env.NODE_ENV === "production" ? PRODUCTION_SPOTIFY_REDIRECT_URI : LOCAL_SPOTIFY_REDIRECT_URI;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!SPOTIFY_CLIENT_SECRET) {
  console.log(chalk.red('You MUST provide a SPOTIFY_CLIENT_SECRET key as an environment variable. e.g: "SPOTIFY_CLIENT_SECRET=#### yarn dev"'));
  console.log(chalk.red('You can get your own SPOTIFY_CLIENT_SECRET key here: https://developer.spotify.com/dashboard/applications. And create an app.'));
  process.exit(1);
}

const app = express();

const port = process.env.PORT || 5001;

const generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

let stateKey = 'spotify_auth_state';

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get(API_LOGIN, (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email user-library-read user-read-currently-playing';
  const stringifiedParams = queryString.stringify({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: state
  });
  res.send({
    spotifyUrl: `${SPOTIFY_AUTHORIZE}?${stringifiedParams}`
  })
});

app.get(API_AUTHENTICATE, (req, res) => {
  const { code } = req.query;

  const authOptions = {
    url: SPOTIFY_API_TOKEN,
    form: {
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const spotifyAccessToken = body.access_token;
      const spotifyRefreshToken = body.refresh_token;
      res.send({
        error: false,
        spotifyAccessToken,
        spotifyRefreshToken,
      })
    } else {
      res.send({
        error: true,
        errorMessage: "Invalid Spotify Token"
      })
    }
  });
});

app.get(API_REFRESH_SPOTIFY_TOKEN, (req, res) => {

  // requesting access token from refresh token
  const { spotifyRefreshToken } = req.query;
  const authOptions = {
    url: SPOTIFY_API_TOKEN,
    headers: { 'Authorization': 'Basic ' + (new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: spotifyRefreshToken
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const spotifyAccessToken = body.access_token;
      res.send({
        spotifyAccessToken
      });
    }
  });
});

app.use(express.static(__dirname + '/client/build'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});