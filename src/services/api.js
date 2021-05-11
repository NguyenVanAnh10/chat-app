import qs from "query-string";

import configs from "configs/configs";

const api = async ({ method, path, params }) => {
  const opts = {
    method,
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let url = `${configs.baseAPI}/${path}`;
  switch (method) {
    case "GET":
      url = qs.stringifyUrl({ url, query: params });
      break;
    case "POST":
      opts.body = JSON.stringify(params);
      break;
    default:
      break;
  }
  try {
    const response = await fetch(url, opts);
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

const apis = {
  GET: (path, params) => api({ method: "GET", path, params }),
  POST: (path, params) => api({ method: "POST", path, params }),
};

export default apis;
