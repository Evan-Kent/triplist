const ApiConfig = require("./security.json");
const fetch = require("node-fetch");

export const ApiRequest = {
  unsplash: {
    url: "https://api.unsplash.com/photos/random?query=camping&featured=true",
    options: {
      method: "GET",
      headers: {
        "Accept-Version": "v1",
        Authorization: "Client-ID " + ApiConfig.unsplash.accessKey
      }
    }
  },
  darksky: {
    url: "",
    options: {}
  },
  maps: {
    geocodeUrl: "",
    options: {
      method: "GET",
      credentials: "omit"
    }
  }
};

function json(response) {
  if (response.headers.has("X-Ratelimit-Remaining"))
    console.log(
      "unsplash X-Ratelimit-Remaining: ",
      response.headers.get("X-Ratelimit-Remaining")
    );
  return response.json();
}

function status(response) {
  if (response.status >= 200 && response.status <= 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

export function fetchWrapper({ url, options }) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(status)
      .then(json)
      .then(
        data => {
          console.log("Response successful", data);
          resolve(data);
        },
        error => {
          console.log("Request failed with error: ", error);
          reject(error);
        }
      );
  });
}
