import { Block } from './block'
import { Transaction } from './transaction'
/**
 * @class BlockChain
 */
export class BlockChain 
{
   /**
    * Variables stored in this block chain.
    */
   public chain: Block[]
   /**
    * Settings for this blockchain
    */
   private maxSupply = 10000000
   private startingValue = 1.05
   /**
    * Initialize the chain with a genesis block.
    * 
    * @constructor
    */
   constructor() 
   {
      this.chain = [this.getGenesisBlock()]
   }
   /**
    * @returns {Block}
    */
   getGenesisBlock(): Block
   {
      return new Block(Date.parse('2021-10-10'), [])
   }
   /**
    * Returns the latest block on our chain.
    * 
    * @returns {Block}
    */
   getLatestBlock(): Block 
   {
      return this.chain[this.chain.length - 1]      
   }
   /**
    * Add a new transaction to the blockchain. A block always
    * exists of 10 transactions before a new block is made.
    * 
    * @param {Transaction} transaction 
    * @returns {boolean | undefined}
    */
   addTransaction(transaction: Transaction)
   {
      /**
       * Check whether the transaction has a sender and a recepient.
       */
      if (!transaction.addressFrom || !transaction.addressTo)
         return false
      /**
       * Check whether the transaction is valid by calculating the hash.
       */
      if (!transaction.isValid())
         return false
      /**
       * Get the latest block from the blockchain.
       */
      const latestBlock = this.getLatestBlock()
      /**
       * If the amount of transactions in the last block is smaller
       * than 10, add this transaction to the latest block.
       * 
       * Otherwise just create a new block and push it there.
       */
      if (latestBlock.transactions.length < 10)
      {
         /**
          * Push it to the existing Transaction[].
          */
         latestBlock.transactions.push(transaction)
         /**
          * Because we altered the array, we must recalculate the hash.
          */
         latestBlock.calculateHash()
      }
      else
      {
         /**
          * Create a new block and immediately push the transaction.
          */
         this.chain.push(new Block(
            Date.now(), [transaction], latestBlock.hash
         ))
      }
   }
   /**
    * The balance of a person isn't stored in a variable. Instead,
    * it is calculated by going through all of his transactions.
    * 
    * @param {string} walletAddress 
    * @returns 
    */
   getBalance(walletAddress: string): number
   {
      /**
       * Get all transactions that were done by this addres.
       */
      const transactions = this.getTransactionsOf(walletAddress)
      let balance = 0
      /**
       * Iterate through every transaction.
       */
      for (const tx of transactions)
      {
         if (tx.addressTo === walletAddress) balance += tx.amount
         if (tx.addressFrom === walletAddress) balance -= tx.amount
      }
      /**
       * Return the balance of the user.
       */
      return balance
   }
   /**
    * Returns a list of all transactions that happened
    * to and from the given wallet address.
    *
    * @param  {string} walletAddress
    * @return {Transaction[]}
    */
   getTransactionsOf(walletAddress: string): Transaction[]
   {
      const transactions: Transaction[] = [];
      /**
       * Iterate through every block.
       */
      for (const block of this.chain)
      {
         /**
          * Iterate through every transaction of this block.
          */
         for (const tx of block.transactions)
         {
            if (tx.addressFrom === walletAddress || tx.addressTo === walletAddress) 
               transactions.push(tx);
         }
      }
      /**
       * Return the transactions.
       */
      return transactions;
   }
   /**
    * Loops over all the blocks in the chain and verify if they are properly
    * linked together and nobody has tampered with the hashes.
    *
    * @returns {boolean}
    */
   checkIntegrity(): boolean
   {
      /**
       * Check if the genesis block hasn't been tampered with by comparing
       * the output of createGenesisBlock with the first block on our chain
       */
      if (this.getGenesisBlock().hash !== this.chain[0].hash)
         return false
      /**
       * Iterate through every block of the chain.
       */
      for (let i = 1; i < this.chain.length; i++)
      {
         const currBlock = this.chain[i]
         const prevBlock = this.chain[i - 1]

         if (!currBlock.isValid()) return false
         if (currBlock.hash !== currBlock.calculateHash()) return false 
         if (currBlock.previousBlock !== prevBlock.hash) return false
      }

      return true
   }
}
