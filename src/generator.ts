import { ec } from 'elliptic'
/**
 * Create a new EC instance.
 */
export const EC = new ec('secp256k1')
/**
 * Generate the public and private key of the user.
 */
const key = EC.genKeyPair()
/**
 * Print both of the keys to the user.
 */
//console.log('Public Key:\n', key.getPublic('hex'));
//console.log('Pricate Key:\n', key.getPrivate('hex'));