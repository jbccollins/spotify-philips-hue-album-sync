import fetch from "isomorphic-fetch";
import {
  PHILIPS_HUB_IP,
  PHILIPS_HUB_USERNAME
} from "common/constants/authorization";
const getLampUrl = lightNumber => {
  const URL =
    "http://" +
    PHILIPS_HUB_IP +
    "/api/" +
    PHILIPS_HUB_USERNAME +
    "/lights/" +
    lightNumber +
    "/state";
  return URL;
};

const requestSetLamp = (lampData, lampUrl) => {
  console.log(lampUrl);
  return fetch(lampUrl, {
    method: "PUT",
    body: JSON.stringify(lampData),
    headers: {
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .then(json => console.log(json));
};

export { requestSetLamp, getLampUrl };
