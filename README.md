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

const ns = await dns.resolve("violetnorth.com", "NS", { servers: ["192.168.0.1"] });
console.log(ns);
// {
//   id: 0,
//   type: 'response',
//   flags: 384,
//   flag_qr: true,
//   opcode: 'QUERY',
//   flag_aa: false,
//   flag_tc: false,
//   flag_rd: true,
//   flag_ra: true,
//   flag_z: false,
//   flag_ad: false,
//   flag_cd: false,
//   rcode: 'NOERROR',
//   questions: [ { name: 'violetnorth.com', type: 'NS', class: 'IN' } ],
//   answers: [
//     {
//       name: 'violetnorth.com',
//       type: 'NS',
//       ttl: 17126,
//       class: 'IN',
//       flush: false,
//       data: 'ns-cloud-b4.googledomains.com'
//     },
//     {
//       name: 'violetnorth.com',
//       type: 'NS',
//       ttl: 17126,
//       class: 'IN',
//       flush: false,
//       data: 'ns-cloud-b1.googledomains.com'
//     },
//     {
//       name: 'violetnorth.com',
//       type: 'NS',
//       ttl: 17126,
//       class: 'IN',
//       flush: false,
//       data: 'ns-cloud-b2.googledomains.com'
//     },
//     {
//       name: 'violetnorth.com',
//       type: 'NS',
//       ttl: 17126,
//       class: 'IN',
//       flush: false,
//       data: 'ns-cloud-b3.googledomains.com'
//     }
//   ],
//   authorities: [],
//   additionals: []
// }

const trace = await dns.trace("violetnorth.com", "NS");
console.log(trace);
// {
//   root: {
//     id: 0,
//     type: 'response',
//     flags: 768,
//     flag_qr: true,
//     opcode: 'QUERY',
//     flag_aa: false,
//     flag_tc: true,
//     flag_rd: true,
//     flag_ra: false,
//     flag_z: false,
//     flag_ad: false,
//     flag_cd: false,
//     rcode: 'NOERROR',
//     questions: [ [Object] ],
//     answers: [],
//     authorities: [
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object]
//     ],
//     additionals: [
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object]
//     ]
//   },
//   tld: {
//     id: 0,
//     type: 'response',
//     flags: 256,
//     flag_qr: true,
//     opcode: 'QUERY',
//     flag_aa: false,
//     flag_tc: false,
//     flag_rd: true,
//     flag_ra: false,
//     flag_z: false,
//     flag_ad: false,
//     flag_cd: false,
//     rcode: 'NOERROR',
//     questions: [ [Object] ],
//     answers: [],
//     authorities: [ [Object], [Object], [Object], [Object] ],
//     additionals: [
//       [Object],
//       [Object],
//       [Object],
//       [Object],
//       [Object],
//       [Object],
//       [Object],
//       [Object]
//     ]
//   },
//   authoritative: {
//     id: 0,
//     type: 'response',
//     flags: 1280,
//     flag_qr: true,
//     opcode: 'QUERY',
//     flag_aa: true,
//     flag_tc: false,
//     flag_rd: true,
//     flag_ra: false,
//     flag_z: false,
//     flag_ad: false,
//     flag_cd: false,
//     rcode: 'NOERROR',
//     questions: [ [Object] ],
//     answers: [ [Object], [Object], [Object], [Object] ],
//     authorities: [],
//     additionals: []
//   }
// }
```

### License

---

Released under the [MIT License](https://github.com/violetnorth/dns/blob/master/LICENSE).