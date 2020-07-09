"use strict";

const dns = require("dns");
const net = require("net");
const dgram = require("dgram");
const dnsPacket = require("dns-packet");

const root = require("./root.json");

const _resolveUDP = (packet, addr, port = 53) => {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket("udp4");

    socket.on("message", message => {
      resolve(dnsPacket.decode(message));
      socket.close();
    });

    socket.on("error", err => {
      reject(err);
    });
    
    socket.send(packet, 0, packet.length, parseInt(port), addr);
  });
};

const _resolveTCP = (packet, addr, port = 53) => {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    let message = Buffer.alloc(2048);
    socket.connect(parseInt(port), addr, () => {
      socket.write(packet);
    });

    socket.on("data", data => {
      message = Buffer.concat([message, data]);
    });

    socket.on("drain", () => {
      resolve(dnsPacket.decode(message));
      socket.close();
    });

    socket.on("end", () => {
      resolve(dnsPacket.decode(message));
      socket.destroy();
    });

    socket.on("error", err => {
      reject(err);
    });

    socket.on("close", function() {
      socket.destroy();
    });
  });
};

exports.resolve = (name, type, opts = {}) => {
  if (!opts.servers || !opts.servers.length) {
    opts.servers = dns.getServers();
  }

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
    queries.push(_resolveUDP(packet, addr, port));
    queries.push(_resolveTCP(packet, addr, port));
  }

  return Promise.race(queries);
};

exports.trace = (name, type) => {
  return new Promise(async (resolve, reject) => {
    const trace = {};

    try {
      const authorities = [];
      for (const authority of root.servers) {
        authorities.push(authority.address)
      }
      trace.root = await this.resolve(name, type, {servers: authorities});
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
        trace.tld = await this.resolve(name, type, {servers: authorities});
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
        trace.authoritative = await this.resolve(name, type, {servers: authorities});
      }
    } catch (err) {
      err = new Error(`lookup from authoritative server failed: ${err}`);
      reject(err);
    }

    resolve(trace);
  });
};
