const request = function (options) {
  let baseUrl = 'http://projects.zhangzhenkai.com/';
  let url = `${baseUrl}${options.url}`;
  const method = options.method;
  const config = {};
  config.method = method || 'get';
  if (method.toUpperCase() === 'POST') {
    config.body = JSON.stringify(options.data);
    // config.body = qsStringify(options.data);
  }
  if (options.params) url = url + '?' + qsStringify(options.params);
  config.headers = new Headers({
    'Content-Type': 'application/json'
    // 'Content-Type': 'multipart/form-data'
    // 'Content-Type': 'application/x-www-form-urlencoded'
  })

  return new Promise((resolve, reject) => {
    fetch(url, config)
    .then(response => {
      response.json().then(res => {
        resolve(res);
      })
    })
    .catch(res => {
      reject(res);
    })
  })
}