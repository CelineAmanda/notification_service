import crypto from 'crypto'

const alice = crypto.createECDH('secp256k1')
alice.generateKeys();
const alicePublicKeyBase64 = alice.getPublicKey().toString('base64');

const credential = {alice:alice, alicePublicKeyBase64:alicePublicKeyBase64}
export default credential