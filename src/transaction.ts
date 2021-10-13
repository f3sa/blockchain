import { createHmac } from "crypto"
import elliptic from 'elliptic'
import { EC } from "./generator"
/**
 * @class Transaction
 */
export class Transaction
{
   /**
    * Variables stored in a transaction.
    */
   public timestamp: number
   public addressFrom: string
   public addressTo: string
   public amount: number
   /**
    * Both these variables could also be undefined
    * because they only get assigned a value when
    * the transaction gets signed by the user.
    */
   public signKey: string | undefined
   public signature: elliptic.ec.Signature | undefined
   /**
    * 
    * @param {string} from The wallet address in hex of the sender.
    * @param {string} to The wallet addres in hex of the recepient.
    * @param {string} amount The amount of coins to be sent.
    */
   constructor(addressFrom: string, addressTo: string, amount: number)
   {
      this.timestamp = Date.now()
      this.addressFrom = addressFrom
      this.addressTo = addressTo
      this.amount = amount
   }
   /**
    * Creates a SHA256 hash of this transaction's uniqueness.
    * 
    * @returns {string}
    */
   calculateHash(): string
   {
      return createHmac('SHA256', this.addressFrom + this.addressTo + this.amount).update('text').digest('hex')
   }
   /**
    * Sign a transaction in the current block.
    * 
    * @param {ec.KeyPair} signKey
    * @returns {boolean | undefined}
    */
   signTransaction(signKey: elliptic.ec.KeyPair)
   {
      /**
       * Get the SHA256-truncated version of your wallet's address.
       */
      const hashedAddress = createHmac(
         'SHA256', signKey.getPublic('hex'))
         .update('text').digest('hex').substring(32)
      /**
       * This transaction was made from a spoofed address.
       */      
      if (hashedAddress !== this.addressFrom)
         return false
      /**
       * Sign the transaction and set to it a value.
       */
      this.signKey = signKey.getPublic('hex')
      this.signature = signKey.sign(this.calculateHash(), 'base64').toDER('hex')
   }
   /**
    * Check whether the transaction is valid by verifying it.
    * 
    * @returns {boolean}
    */
   isValid(): boolean
   {
      /**
       * This transaction came from the system, thus null.
       */
      if (this.addressFrom === null)
         return true 
      /**
       * The transaction does not have a signature set.
       */
      if (this.signature === undefined)
         return false 
      /**
       * The sign key is not defined, thus not signed.
       */
      if (this.signKey === undefined)
         return false
      /**
       * Return a verification whether it's the right signature.
       */
      return EC.keyFromPublic(this.signKey, 'hex').verify(this.calculateHash(), this.signature)
   }
}