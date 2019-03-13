import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { displayMode } from "./controls";
import { track, spotifyTokens } from "./spotify";
export default history =>
  combineReducers({
    displayMode,
    track,
    spotifyTokens,
    router: connectRouter(history)
  });
