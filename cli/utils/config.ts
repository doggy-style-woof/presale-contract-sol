import * as anchor from "@coral-xyz/anchor";
import fs from "fs";
import {
    Connection,
    Keypair,
} from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { Presale } from "../../target/types/presale";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

// Configure the client to use the local cluster.
export const connection = new Connection("https://api.devnet.solana.com", "confirmed");

let wallet = new NodeWallet(Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync("./../../admin.json", "utf-8")))));

anchor.setProvider(new anchor.AnchorProvider(connection, wallet, {
  commitment: "processed",
}));

export const program = anchor.workspace.Presale as Program<Presale>;

export const usdcKp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync("./tests/keys/usdc.json", "utf-8"))));
export const usdtKp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync("./tests/keys/usdt.json", "utf-8"))));

export const vaultKp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync("./tests/keys/vault.json", "utf-8"))));