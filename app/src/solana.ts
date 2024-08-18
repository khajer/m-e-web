// src/solana.js
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import idl from '../../program/target/idl/money_expense.json'


// Connect to the Devnet or any other cluster
// const connection = new Connection(clusterApiUrl('devnet'));
const connection = new Connection('http://127.0.0.1:8899');

let idl;

const programId = new PublicKey("11111111111111111111111111111111")

async function getBalance(key: PublicKey) {
    const balanceLamports = await connection.getBalance(key);
    return balanceLamports / 1e9;
}
async function callMethod() {

}


export { connection, PublicKey, callMethod, getBalance };