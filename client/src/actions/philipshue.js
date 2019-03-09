import fetch from "isomorphic-fetch";

const getLampUrl = lightNumber => {
  var hubIP = "10.0.0.92";
  var username = "WZ1wvNs08Lp7Ru4bcVGPF45uPKbOJBoxqggD5wRq";
  var URL =
    "http://" +
    hubIP +
    "/api/" +
    username +
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
