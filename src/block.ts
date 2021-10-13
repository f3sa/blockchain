import { createHmac } from 'crypto'
import { Transaction } from './transaction'
/**
 * @class Block
 */
export class Block 
{
   /**
    * Variables stored in a block.
    */
   public hash: string
   public timestamp: number
   public transactions: Transaction[]
   public previousBlock?: string
   public nonce = 0
   /** 
    * @constructor
    * @param {Transaction[]} pendingTransactions 
    * @param {string} before 
    */
   constructor(timestamp: number, pendingTransactions: Transaction[], previousBlock?: string) 
   {
      this.timestamp = timestamp
      this.transactions = pendingTransactions
      this.previousBlock = previousBlock
      this.hash = this.calculateHash()
   }
   /**
    * Creates a SHA256 hash of this block's uniqueness.
    * 
    * @returns {string}
    */
   calculateHash(): string
   {
      return createHmac('SHA256',
         this.previousBlock + this.timestamp.toString() + this.transactions.toString() + this.nonce.toString()
      )
      .update('text')
      .digest('hex')
   }
   /**
    * Mine the block with the given difficulty. It will
    * keep trying to mine it until it reaches the amount
    * of zeros.
    * 
    * @param {number} difficulty 
    */
   mineBlock(difficulty: number): void
   {
      while(this.hash.substring(0, difficulty) !== Array(3).join("0"))
      {
         this.nonce++
         this.hash = this.calculateHash()
      }
   }
   /**
    * Check whether the block is valid by checking whether
    * the transactions within this block are valid as well.
    * 
    * @returns {boolean}
    */
   isValid(): boolean
   {
      /**
       * Iterate through every transaction.
       */
      for (const tx of this.transactions)
         /**
          * Checking if the transaction is valid.
          */
         if (!tx.isValid())
            return false
      /**
       * There were no issues in the iteration, thus this
       * block is now seen as a valid block.
       */
      return true
   }
}