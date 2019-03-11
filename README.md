
## About
#### A react webapp that syncs your Philips Hue lights with the most prominent colors in the album art for your currently playing Spotify track.

<img src="example-screenshot.png" alt="example-screenshot">

## Installation


```bash
brew install watch
pip install osascript
yarn rebuild
```

## Get started

```bash
SPOTIFY_CLIENT_SECRET=***** yarn dev
```

In a separate terminal window run
```bash
yarn poll-spotify
```

Open up `/common/constants/authorization.js` and change the variables in that file to match your Philips and Spotify config. Note that the `SPOTIFY_CLIENT_SECRET` variable MUST be passed to your app as an environment variable.
If you don't already have a Spotify developer account you can get one here: https://developer.spotify.com/dashboard/applications

Open up `AlbumContainer.js`. You'll see a line like

```javascript
    const lampIds = [1, 4];
```

This is the array of Philips Hue Lamp ids. Add up to four ids to this array. The order of the ids in this array is the order in which hues will be prioritized.

Open up `createLog.applescript` and change the log file path to whatever floats your boat.

## Scripts
| Script | Description |
|---|---|
| rebuild | Nuke the client and server node_modules then reinstall everything |
| dev | Concurrently run the client and server in development mode |
| start | Default heroku command to run a node app. Not useful when developing |
| postinstall | Default heroku command to build the client. Not useful when developing |

## Troubleshooting
If you use `n` to manage your node versions then you might run into an issue where you are prompted to allow incoming connections everytime you start up the server. To fix this do this:
```bash
# remove current entry in firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --remove /usr/local/bin/node && \
# copy current node from n
cp -pf /usr/local/n/versions/node/$(node -v | cut -d 'v' -f 2)/bin/node /usr/local/bin && \
# add to firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
```
###### From: https://github.com/tj/n/issues/394#issuecomment-359570847

Then restart your terminal.

This boilerplate is built using [create-react-app](https://github.com/facebookincubator/create-react-app) so you will want to read the User Guide for more goodies.
