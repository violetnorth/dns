"use strict";

exports.rand = (arr) => {
  if (arr.length) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return "";
};