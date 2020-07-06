# DNS

DNS lookup and trace. 

### Usage

#### `lookup`
Makes a DNS lookup with the specified name and type to the specified DNS server. (Only supports UDP).

#### `trace`
Traces the DNS delegation starting from a random root DNS server, moving to a random TLD DNS server and finalizing at the authoritative DNS server.
Returns an array of responses:
- first response is the root DNS server response.
- second response is the TLD DNS server response.
- third response is the Authoritative DNS server response.

### Install

---

Install with [npm](https://www.npmjs.com/):

```shell
$ npm install --save @violetnorth/dns
```

### Usage

```javascript
const dns = require("@violetnorth/dns");

const soa = await dns.resolve("violetnorth.com", "SOA", "8.8.8.8");
console.log(soa);
// {
//   "id": 0,
//   "type": "response",
//   "flags": 384,
//   "flag_qr": true,
//   "opcode": "QUERY",
//   "flag_aa": false,
//   "flag_tc": false,
//   "flag_rd": true,
//   "flag_ra": true,
//   "flag_z": false,
//   "flag_ad": false,
//   "flag_cd": false,
//   "rcode": "NOERROR",
//   "questions": [
//     {
//       "name": "violetnorth.com",
//       "type": "A",
//       "class": "IN"
//     }
//   ],
//   "answers": [
//     {
//       "name": "violetnorth.com",
//       "type": "A",
//       "ttl": 3599,
//       "class": "IN",
//       "flush": false,
//       "data": "216.239.32.21"
//     },
//     {
//       "name": "violetnorth.com",
//       "type": "A",
//       "ttl": 3599,
//       "class": "IN",
//       "flush": false,
//       "data": "216.239.34.21"
//     },
//     {
//       "name": "violetnorth.com",
//       "type": "A",
//       "ttl": 3599,
//       "class": "IN",
//       "flush": false,
//       "data": "216.239.36.21"
//     },
//     {
//       "name": "violetnorth.com",
//       "type": "A",
//       "ttl": 3599,
//       "class": "IN",
//       "flush": false,
//       "data": "216.239.38.21"
//     }
//   ],
//   "authorities": [],
//   "additionals": []
// }

const trace = await dns.trace("violetnorth.com", "SOA");
console.log(trace);
// [
//   {
//     "id": 0,
//     "type": "response",
//     "flags": 256,
//     "flag_qr": true,
//     "opcode": "QUERY",
//     "flag_aa": false,
//     "flag_tc": false,
//     "flag_rd": true,
//     "flag_ra": false,
//     "flag_z": false,
//     "flag_ad": false,
//     "flag_cd": false,
//     "rcode": "NOERROR",
//     "questions": [
//       {
//         "name": "violetnorth.com",
//         "type": "A",
//         "class": "IN"
//       }
//     ],
//     "answers": [],
//     "authorities": [
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "a.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "b.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "c.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "d.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "e.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "f.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "g.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "h.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "i.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "j.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "k.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "l.gtld-servers.net"
//       },
//       {
//         "name": "com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "m.gtld-servers.net"
//       }
//     ],
//     "additionals": [
//       {
//         "name": "a.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.5.6.30"
//       },
//       {
//         "name": "b.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.33.14.30"
//       },
//       {
//         "name": "c.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.26.92.30"
//       },
//       {
//         "name": "d.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.31.80.30"
//       },
//       {
//         "name": "e.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.12.94.30"
//       },
//       {
//         "name": "f.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.35.51.30"
//       },
//       {
//         "name": "g.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.42.93.30"
//       },
//       {
//         "name": "h.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.54.112.30"
//       },
//       {
//         "name": "i.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.43.172.30"
//       },
//       {
//         "name": "j.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.48.79.30"
//       },
//       {
//         "name": "k.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.52.178.30"
//       },
//       {
//         "name": "l.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.41.162.30"
//       },
//       {
//         "name": "m.gtld-servers.net",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "192.55.83.30"
//       },
//       {
//         "name": "a.gtld-servers.net",
//         "type": "AAAA",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "2001:503:a83e::2:30"
//       }
//     ]
//   },
//   {
//     "id": 0,
//     "type": "response",
//     "flags": 256,
//     "flag_qr": true,
//     "opcode": "QUERY",
//     "flag_aa": false,
//     "flag_tc": false,
//     "flag_rd": true,
//     "flag_ra": false,
//     "flag_z": false,
//     "flag_ad": false,
//     "flag_cd": false,
//     "rcode": "NOERROR",
//     "questions": [
//       {
//         "name": "violetnorth.com",
//         "type": "A",
//         "class": "IN"
//       }
//     ],
//     "answers": [],
//     "authorities": [
//       {
//         "name": "violetnorth.com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "ns-cloud-b1.googledomains.com"
//       },
//       {
//         "name": "violetnorth.com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "ns-cloud-b2.googledomains.com"
//       },
//       {
//         "name": "violetnorth.com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "ns-cloud-b3.googledomains.com"
//       },
//       {
//         "name": "violetnorth.com",
//         "type": "NS",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "ns-cloud-b4.googledomains.com"
//       }
//     ],
//     "additionals": [
//       {
//         "name": "ns-cloud-b1.googledomains.com",
//         "type": "AAAA",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "2001:4860:4802:32::6b"
//       },
//       {
//         "name": "ns-cloud-b1.googledomains.com",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "216.239.32.107"
//       },
//       {
//         "name": "ns-cloud-b2.googledomains.com",
//         "type": "AAAA",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "2001:4860:4802:34::6b"
//       },
//       {
//         "name": "ns-cloud-b2.googledomains.com",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "216.239.34.107"
//       },
//       {
//         "name": "ns-cloud-b3.googledomains.com",
//         "type": "AAAA",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "2001:4860:4802:36::6b"
//       },
//       {
//         "name": "ns-cloud-b3.googledomains.com",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "216.239.36.107"
//       },
//       {
//         "name": "ns-cloud-b4.googledomains.com",
//         "type": "AAAA",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "2001:4860:4802:38::6b"
//       },
//       {
//         "name": "ns-cloud-b4.googledomains.com",
//         "type": "A",
//         "ttl": 172800,
//         "class": "IN",
//         "flush": false,
//         "data": "216.239.38.107"
//       }
//     ]
//   },
//   {
//     "id": 0,
//     "type": "response",
//     "flags": 1280,
//     "flag_qr": true,
//     "opcode": "QUERY",
//     "flag_aa": true,
//     "flag_tc": false,
//     "flag_rd": true,
//     "flag_ra": false,
//     "flag_z": false,
//     "flag_ad": false,
//     "flag_cd": false,
//     "rcode": "NOERROR",
//     "questions": [
//       {
//         "name": "violetnorth.com",
//         "type": "A",
//         "class": "IN"
//       }
//     ],
//     "answers": [
//       {
//         "name": "violetnorth.com",
//         "type": "A",
//         "ttl": 3600,
//         "class": "IN",
//         "flush": false,
//         "data": "216.239.32.21"
//       },
//       {
//         "name": "violetnorth.com",
//         "type": "A",
//         "ttl": 3600,
//         "class": "IN",
//         "flush": false,
//         "data": "216.239.34.21"
//       },
//       {
//         "name": "violetnorth.com",
//         "type": "A",
//         "ttl": 3600,
//         "class": "IN",
//         "flush": false,
//         "data": "216.239.36.21"
//       },
//       {
//         "name": "violetnorth.com",
//         "type": "A",
//         "ttl": 3600,
//         "class": "IN",
//         "flush": false,
//         "data": "216.239.38.21"
//       }
//     ],
//     "authorities": [],
//     "additionals": []
//   }
// ]
```

### License

---

Released under the [MIT License](https://github.com/violetnorth/dns/blob/master/LICENSE).