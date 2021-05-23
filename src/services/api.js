import qs from "query-string";

import configs from "configs/configs";

function ExceptionError({ name, message }) {
  return { name, message };
}

const api = async ({ method, path, params }) => {
  const opts = {
    method,
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let url = `${configs.baseAPI}${path}`;
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
  const response = await fetch(url, opts);
  switch (response.status) {
    case 200:
      return await response.json();
    case 504:
      throw new ExceptionError({
        name: "Error",
        message: response.statusText,
      });
    default:
      const { error } = await response.json();
      throw error;
  }
};

const apis = {
  GET: (path, params) => api({ method: "GET", path, params }),
  POST: (path, params) => api({ method: "POST", path, params }),
};

export default apis;
