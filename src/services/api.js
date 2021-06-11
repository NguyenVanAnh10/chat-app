import qs from 'query-string';

import configs from 'configs/configs';

function ExceptionError({ name, message }) {
  return { name, message };
}

const api = async ({ method, path, params }) => {
  const opts = {
    method,
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let url = `${configs.baseAPI}${path}`;
  switch (method) {
    case 'GET':
      url = qs.stringifyUrl({ url, query: params });
      break;
    case 'POST':
      opts.body = JSON.stringify(params);
      break;
    default:
      break;
  }
  const response = await fetch(url, opts);
  let result;
  switch (response.status) {
    case 200:
      result = await response.json();
      return result;
    case 504:
      throw new ExceptionError({
        name: 'Error',
        message: response.statusText,
      });
    default:
      result = await response.json();
      throw result.error;
  }
};

const apis = {
  GET: (path, params) => api({ method: 'GET', path, params }),
  POST: (path, params) => api({ method: 'POST', path, params }),
};

export default apis;
