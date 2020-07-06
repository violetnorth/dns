"use strict";

const dgram = require("dgram");
const dnsPacket = require("dns-packet");

const lib = require("./lib");
const root = require("./root");

exports.resolve = (name, type, server = null, port = 53) => {
  return new Promise((resolve, reject) => {

    if (server === null) {
      const err = new Error("server is required for dns lookup");
      return reject(err);
    }

    type = type.toUpperCase();

    const buf = dnsPacket.encode({
      type: "query",
      flags: dnsPacket.RECURSION_DESIRED,
      questions: [{
        type,
        name,
      }],
    });
    
    const socket = dgram.createSocket("udp4");
    socket.on("message", message => {
      resolve(dnsPacket.decode(message));
      socket.close();
    });

    socket.on("error", error => {
      reject(error);
    });
    
    socket.send(buf, 0, buf.length, port, server)
  });
};

exports.trace = (name, type) => {
  return new Promise((resolve, reject) => {
    const trace = [];

    const rootServer = lib.rand(root.servers).address;
    this.resolve(name, type, rootServer)
      .then(rootResponse => {
        trace.push(rootResponse);

        const tldServer = lib.rand(rootResponse.authorities.map(a => a.data));
        this.resolve(name, type, tldServer)
          .then(tldResponse => {
            trace.push(tldResponse);

            const authoritativeServer = lib.rand(tldResponse.authorities.map(a => a.data));
            this.resolve(name, type, authoritativeServer)
              .then(authoritativeResponse => {
                trace.push(authoritativeResponse);
                resolve(trace);
              })
              .catch(err => {
                err = new Error(`lookup from authoritative server ${authoritativeServer.address} failed: ${err}`);
                reject(err);
              });
          })
          .catch(err => {
            err = new Error(`lookup from tld server ${tldServer.address} failed: ${err}`);
            reject(err);
          });
      })
      .catch(err => {
        err = new Error(`lookup from root server ${rootServer.address} failed: ${err}`);
        reject(err);
      })
  });
};
