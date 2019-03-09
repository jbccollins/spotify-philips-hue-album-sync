import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { displayMode } from "./controls";
import { track } from "./spotify";
export default history =>
  combineReducers({
    displayMode,
    track,
    router: connectRouter(history)
  });
