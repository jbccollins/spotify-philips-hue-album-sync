import fetch from "isomorphic-fetch";
import {
  PHILIPS_HUB_IP,
  PHILIPS_HUB_USERNAME
} from "common/constants/authorization";
const getLampUrl = lightNumber => {
  const URL =
    "https://" +
    PHILIPS_HUB_IP +
    "/api/" +
    PHILIPS_HUB_USERNAME +
    "/lights/" +
    lightNumber +
    "/state";
  return URL;
};

const requestSetLamp = async (lampData, lampUrl) => {
  await fetch(lampUrl, {
    method: "PUT",
    body: JSON.stringify(lampData),
    headers: {
      Accept: "application/json"
    }
  });
};

export { requestSetLamp, getLampUrl };
