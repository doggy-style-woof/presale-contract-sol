import * as anchor from "@coral-xyz/anchor";
import { Program, Provider, web3 } from '@coral-xyz/anchor';
import fs from 'fs';

import {
    PublicKey,
    Keypair,
    Connection,
} from '@solana/web3.js';

import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

import { Presale } from "../target/types/presale";
import { createSetStageTx, createSetVaultAddressTx, createStartPresaleTx } from '../lib/scripts';
import { execTx } from "../lib/util";
import {GLOBAL_SEED} from "../tests/constant";

let solConnection: Connection = null;
let program: Program<Presale> = null;
let provider: Provider = null;
export let payer: NodeWallet = null;

/**
 * Set cluster, provider, program
 * If rpc != null use rpc, otherwise use cluster param
 * @param cluster - cluster ex. mainnet-beta, devnet ...
 * @param keypair - wallet keypair
 * @param rpc - rpc
 */
export const setClusterConfig = async (
    cluster: web3.Cluster,
    keypair: Keypair|string,
    rpc?: string
) => {

    if (!rpc) {
        solConnection = new web3.Connection(web3.clusterApiUrl(cluster));
    } else {
        solConnection = new web3.Connection(rpc);
    }

    let walletKeypair
    if(typeof keypair === 'string') {
        walletKeypair = Keypair.fromSecretKey(
          Uint8Array.from(JSON.parse(fs.readFileSync(keypair, 'utf-8'))),
          {skipValidation: true});
    } else {
        walletKeypair = keypair;
    }

    const wallet = new NodeWallet(walletKeypair);

    // Configure the client to use the local cluster.
    anchor.setProvider(new anchor.AnchorProvider(
        solConnection,
        wallet,
        { skipPreflight: true, commitment: 'confirmed' }));
    payer = wallet;

    provider = anchor.getProvider();
    console.log('Wallet Address: ', wallet.publicKey.toBase58());

    // Generate the program client from IDL.
    program = anchor.workspace.Presale as Program<Presale>;

    console.log('ProgramId: ', program.programId.toBase58());
}

/**
 * Initialize program
 * Called by admin right after the program deployment
 * to initialize global state
 */
export const initProject = async (adminKp) => {
    const [globalStateAddr, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_SEED)],
      program.programId
    );

    const tx = await program.methods.initialize()
      .accounts({
        admin: adminKp.publicKey,
      })
      .signers([adminKp])
      .rpc();
    console.log("initialize tx: ", tx);

    const globalState = await program.account.globalState.fetch(globalStateAddr);
    const sum = globalState.remainTokens.reduce((acc, num) => acc + num.toNumber(), 0);
    console.log("total tokens needed: ", sum);

    // const tx = await createInitializeTx(payer.publicKey, token, program);

    // tx.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;

    // await execTx(tx, solConnection, payer);
}

export const setVaultAddress = async (
    vault: PublicKey
) => {
    const tx = await createSetVaultAddressTx(payer.publicKey, vault, program);

    tx.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;

    await execTx(tx, solConnection, payer);
}

export const startPresale = async (
    token: PublicKey
) => {
    const tx = await createStartPresaleTx(payer.publicKey, token, program);

    tx.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;

    await execTx(tx, solConnection, payer);
}

export const setStage = async (
    stageNum: number
) => {
    const tx = await createSetStageTx(payer.publicKey, stageNum, program);

    tx.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;

    await execTx(tx, solConnection, payer);
}
