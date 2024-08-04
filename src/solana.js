// src/solana.js
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Connect to the Devnet or any other cluster
// const connection = new Connection(clusterApiUrl('devnet'));
const connection = new Connection('http://127.0.0.1:8899');

export { connection, PublicKey };