const crypto = require('crypto')

const bob = crypto.createECDH('secp256k1')
bob.generateKeys();
const bobPublicKeyBase64 = bob.getPublicKey().toString('base64');

module.exports= {bob, bobPublicKeyBase64}