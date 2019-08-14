const ApiConfig = require("./security.json");
const fetch = require("node-fetch");

export const ApiRequest = {
  unsplash: {
    url: "https://api.unsplash.com/photos/random?query=camping&featured=true",
    options: {
      method: 'GET',
      headers: {
        "Accept-Version": "v1",
        "Authorization": "Client-ID " + ApiConfig.unsplash.accessKey,
      },
    }
  },
  darksky: {
    url: "",
    options: {}
  },
  maps: {
    geocodeUrl: "",
    options: {}
  },
};

function json(response) {
  if (response.headers.has('X-Ratelimit-Remaining'))
    console.log('unsplash X-Ratelimit-Remaining: ', response.headers.get("X-Ratelimit-Remaining"));
  return response.json();
}

function status(response) {
  if (response.status >= 200 && response.status <= 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

export function fetchWrapper(target) {
  return new Promise((resolve, reject) => {
    fetch(target.url, target.options).then(status).then(json)
      .then(data => {
          console.log("Response successful");
          resolve(data);
        },
        error => {
          console.log("Request failed with error: ", error);
          reject(error);
        }
      );
  });
}
/*
<iframe width="600" height="450" frameBorder="0" style="border:0"
        src="https://www.google.com/maps/embed/v1/search?q=Yellowstone%20National%20Park%2C%20WY%2C%20USA&key=AIzaSyCyXH_SOrDi02C9x_-KdUcLPvq5foW3Ppk"
        allowFullScreen></iframe> */