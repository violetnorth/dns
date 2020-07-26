"use strict";

const dns = require("dns");
const net = require("net");
const dgram = require("dgram");
const dnsPacket = require("dns-packet");

const root = require("./root.json");

const _promiseSleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const _promiseTimeout = (ms, promise) => {
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

const _resolveUDP = (packet, addr, port = 53) => {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket("udp4");

    socket.on("message", message => {
      socket.close();
      resolve(dnsPacket.decode(message));
      return;
    });

    socket.on("error", err => {
      socket.close();
      reject(err);
      return;
    });

    socket.send(packet, 0, packet.length, parseInt(port), addr, err => {
      if (err) {
        socket.close();
        reject(err);
        return;
      }
    });
  });
};

const _resolveTCP = (packet, addr, port = 53) => {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    socket.connect(parseInt(port), addr, () => {
      socket.write(packet);
    });

    let message = Buffer.alloc(4096);
    socket.on("data", data => {
      message = Buffer.concat([message, data], message.length + data.length);
    });

    socket.on("drain", () => {
      socket.destroy();
      resolve(dnsPacket.decode(message));
      return;
    });

    socket.on("end", () => {
      socket.destroy();
      resolve(dnsPacket.decode(message));
      return;
    });

    socket.on("error", err => {
      socket.destroy();
      reject(err);
      return;
    });

    socket.on("close", function() {
      socket.destroy();
      resolve(dnsPacket.decode(message));
      return;
    });
  });
};

exports._resolve = (name, type, opts = {}) => {
  const packet = dnsPacket.encode({
    type: "query",
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [{
      type,
      name,
    }],
  });

  const queries = [];
  for (const server of opts.servers) {
    const [addr, port] = server.split(":");
    if (opts.protocols.includes("udp")) {
      const query = _promiseTimeout(parseInt(opts.timeout), _resolveUDP(packet, addr, port));
      queries.push(query);
    }
    if (opts.protocols.includes("tcp")) {
      const query = _promiseTimeout(parseInt(opts.timeout), _resolveTCP(packet, addr, port));
      queries.push(query);
    }
  }

  return Promise.race(queries);
};

exports.resolve = (name, type, opts = {}) => {
  return new Promise(async (resolve, reject) => {
    if (!opts.servers || !opts.servers.length) {
      opts.servers = dns.getServers();
    }
  
    if (!opts.protocols || !opts.protocols.length) {
      opts.protocols = ["udp"];
    }
  
    if (!opts.timeout) {
      opts.timeout = 5000;
    }
  
    if (!opts.retry) {
      opts.retry = 1;
    }

    if (!opts.backoff) {
      opts.backoff = 0;
    }

    let err;
    for (let i = 0; i < parseInt(opts.retry); i++) {
      try {
        const resp = await this._resolve(name, type, opts);
        return resolve(resp);
      } catch (e) {
        err = e;
      }
      await _promiseSleep(parseInt(opts.backoff))
    }

    reject(err);
  });
}

exports.trace = (name, type, opts = {}) => {
  return new Promise(async (resolve, reject) => {
    const trace = {};

    try {
      const authorities = [];
      for (const authority of root.servers) {
        authorities.push(authority.address)
      }
      trace.root = await this.resolve(name, type, {...opts, servers: authorities});
    } catch (err) {
      err = new Error(`lookup from root server failed: ${err}`);
      reject(err);
    }

    try {
      if (trace.root.authorities && trace.root.authorities.length) {
        const authorities = [];
        for (const authority of trace.root.authorities) {
          if (authority.type === "NS") {
            authorities.push(authority.data)
          }
        }
        trace.tld = await this.resolve(name, type, {...opts, servers: authorities});
      }
    } catch (err) {
      err = new Error(`lookup from tld server failed: ${err}`);
      reject(err);
    }

    try {
      if (trace.tld.authorities && trace.tld.authorities.length) {
        const authorities = [];
        for (const authority of trace.tld.authorities) {
          if (authority.type === "NS") {
            authorities.push(authority.data)
          }
        }
        trace.authoritative = await this.resolve(name, type, {...opts, servers: authorities});
      }
    } catch (err) {
      err = new Error(`lookup from authoritative server failed: ${err}`);
      reject(err);
    }

    resolve(trace);
  });
};
