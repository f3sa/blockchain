import { createHmac } from 'crypto'
import { BlockChain } from './chain'
import { EC } from './generator'
import { Transaction } from './transaction'

const key = EC.keyFromPrivate('aa2519777b2fc4e38ddf4c533388e6ac941a863746570070bdfee3647f279c2b')
const walletAddress = createHmac('SHA256', key.getPublic('hex')).update('text').digest('hex').substring(32)

const tx = new Transaction(walletAddress, 'recipient here', 1.5564)
tx.signTransaction(key)

const namelessCoin = new BlockChain()
namelessCoin.addTransaction(tx)
/**
 * Proof of concept shown here.
 */
console.log('Is chain valid:', namelessCoin.checkIntegrity());
console.log('Amount of blocks:', namelessCoin.chain.length);
console.log('-------- All blocks --------');
console.log(namelessCoin.chain);
console.log(' ');
console.log(' ');
console.log('-------- Block #1 Transactions --------');
console.log(namelessCoin.chain[0].transactions);
console.log(' ');
console.log(' ');
console.log('-------- User --------');
console.log('Wallet address:', walletAddress);
console.log('Balance:', namelessCoin.getBalance(walletAddress));
console.log('Recipient balance', namelessCoin.getBalance('recipient here'));







