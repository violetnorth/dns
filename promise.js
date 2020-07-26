"use strict";

exports.timeout = (ms, promise) => {
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject("timed out")
    }, parseInt(ms))
  });

  return Promise.race([
    promise,
    timeout
  ]);
};

exports.retry = (attempts, promise) => {
  return new Promise(async (resolve, reject) => {
    let err;
    for (let i = 0; i < parseInt(attempts); i++) {
      try {
        const resp = await promise;
        return resolve(resp);
      } catch (e) {
        err = e;
      }
    }
    reject(err);
  });
};