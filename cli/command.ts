import {program} from "commander";
import {Keypair, PublicKey} from "@solana/web3.js";
import {
  setClusterConfig,
  setStage,
  setVaultAddress,
  startPresale,
} from "./scripts";
import {GLOBAL_SEED, USER_SEED, LAMPORTS_PER_SOL} from "../tests/constant";
import {connection, program as solProgram, usdcKp, usdtKp, vaultKp} from "./config";
import {createMints} from "./create-mints";
import {airdropToken} from "./airdrop-tokens";
import {payer} from "./scripts";
import fs from "fs";
import {getAssociatedTokenAccount} from "../tests/utils";
import {expect} from "chai";
import {BN} from "bn.js";
import bs58 from "bs58";


program.version("0.0.1");


const vaultPublicAddress: string = ''; // DAO address


// Initialize the program
programCommand("init")
  .action(async (directory, cmd) => {
    const {env, keypair, rpc} = cmd.opts(); // keypair - admin.json

    console.log("Solana Cluster:", env);
    console.log("Keypair Path:", keypair);
    console.log("RPC URL:", rpc);

    await setClusterConfig(env, keypair, rpc);

    const [globalStateAddr, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_SEED)],
      solProgram.programId
    );
    console.log("globalStateAddr: ", globalStateAddr.toBase58());

    const walletKeypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(fs.readFileSync(keypair, 'utf-8'))),
      {skipValidation: true});

    const tx = await solProgram.methods.initialize()
      .accounts({
        admin: payer.publicKey,
      })
      .signers([walletKeypair])
      .rpc();
    console.log("initialize tx: ", tx);
    await connection.confirmTransaction(tx);
  });


// Deploy stablecoins contract and mint them to the user
programCommand("deploy-stablecoins")
  .option("-u, --user <string>", "user wallet address to receive tokens")
  .action(async (directory, cmd) => {
    const {env, keypair, rpc, user} = cmd.opts(); // keypair - admin.json

    await setClusterConfig(env, keypair, rpc);

    const walletKeypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(fs.readFileSync(keypair, 'utf-8'))),
      {skipValidation: true});

    console.log("create USDC/USDT");
    await createMints(walletKeypair);

    console.log("airdrop tokens");
    await airdropToken(usdcKp, usdcKp, walletKeypair, new PublicKey(user), 1_000_000_000);
    await airdropToken(usdtKp, usdtKp, walletKeypair, new PublicKey(user), 1_000_000_000);
  });


// Set DAO vault and generate associated token accounts for USDC and USDT
programCommand("set-vault")
  .option("-v, --vault <string>", "dao wallet address")
  .action(async (directory, cmd) => {
    const {env, keypair, rpc, vault} = cmd.opts();

    console.log("Solana Cluster:", env);
    console.log("Keypair Path:", keypair);
    console.log("RPC URL:", rpc);

    await setClusterConfig(env, keypair, rpc);

    const walletKeypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(fs.readFileSync(keypair, 'utf-8'))),
      {skipValidation: true});

    const usdcVault = getAssociatedTokenAccount(new PublicKey(vault), usdcKp.publicKey);
    const usdtVault = getAssociatedTokenAccount(new PublicKey(vault), usdtKp.publicKey);
    console.log("vault: ", new PublicKey(vault).toBase58());
    console.log("usdcVault: ", usdcVault.toBase58());
    console.log("usdtVault: ", usdtVault.toBase58());
    console.log("admin: ", walletKeypair.publicKey.toBase58());

    const [globalStateAddr, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_SEED)],
      solProgram.programId
    );

    try {
      const tx = await solProgram.methods.setVaultAddress()
        .accounts({
          admin: walletKeypair.publicKey,
          vault: new PublicKey(vault),
          usdcVault,
          usdtVault
        })
        .signers([walletKeypair])
        .rpc();
      console.log("set dao wallet tx: ", tx);
    } catch (e) {
      console.log(e)
      return
    }

    const globalState = await solProgram.account.globalState.fetch(globalStateAddr);
    console.log("multi-sig wallet addr: ", globalState.vault.toBase58());
  });


// Start presale
programCommand("start-presale")
  .action(async (directory, cmd) => {
    const {env, keypair, rpc, token} = cmd.opts();

    console.log("Solana Cluster:", env);
    console.log("Keypair Path:", keypair);
    console.log("RPC URL:", rpc);

    await setClusterConfig(env, keypair, rpc);

    const walletKeypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(fs.readFileSync(keypair, 'utf-8'))),
      {skipValidation: true});

    const [globalStateAddr, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_SEED)],
      solProgram.programId
    );

    console.log("globalStateAddr: ", globalStateAddr.toBase58());

    const tx = await solProgram.methods.startPresale()
      .accounts({
        admin: walletKeypair.publicKey
      })
      .signers([walletKeypair])
      .rpc();

    console.log("start presale tx: ", tx);
  });


// Update stage
programCommand("set-stage")
  .option("-s, --stage <number>", "stage number")
  .action(async (directory, cmd) => {
    const {env, keypair, rpc, stage} = cmd.opts();

    console.log("Solana Cluster:", env);
    console.log("Keypair Path:", keypair);
    console.log("RPC URL:", rpc);

    await setClusterConfig(env, keypair, rpc);

    const walletKeypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(fs.readFileSync(keypair, 'utf-8'))),
      {skipValidation: true});

    const [globalStateAddr, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_SEED)],
      solProgram.programId
    );

    const tx = await solProgram.methods.setStage(1)
      .accounts({
        admin: walletKeypair.publicKey,
      })
      .signers([walletKeypair])
      .rpc({commitment: "confirmed"});

    console.log("set stage tx: ", tx);
  });


// Generate associated token accounts for the user (usdt & usdc)
programCommand("user-state")
  .option("-pk, --privateKey <string>", "user's private key")
  .action(async (directory, cmd) => {
    const {env, keypair, rpc, privateKey} = cmd.opts();

    if (!privateKey) {
      console.log("private key is required");
      return;
    }

    console.log("Solana Cluster:", env);
    console.log("Keypair Path:", keypair);
    console.log("RPC URL:", rpc);

    let userWalletKeypair: Keypair;
    try {
      userWalletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    } catch (e) {
      console.log('Private Key is invalid');
      console.log(e);
      return;
    }

    await setClusterConfig(env, userWalletKeypair, rpc);

    const [userStateAddr, _userIx] = PublicKey.findProgramAddressSync(
      [userWalletKeypair.publicKey.toBuffer(), Buffer.from(USER_SEED)],
      solProgram.programId
    );

    console.log("userStateAddr: ", userStateAddr.toBase58());

    const tx = await solProgram.methods.initUser()
      .accounts({
        user: userWalletKeypair.publicKey,

      })
      .signers([userWalletKeypair])
      .rpc();

    console.log("init user tx: ", tx);

    const userState = await solProgram.account.userState.fetch(userStateAddr);
  });


// Buy tokens with SOL
programCommand("buy")
  .option("-pk, --privateKey <string>", "user's private key")
  .option("-a, --amount <string>", "amount with 9 decimals (10_000_000 = 0.01 SOL), default = 10_000_000")
  .action(async (directory, cmd) => {
    const {env, keypair, rpc, privateKey, amount} = cmd.opts();

    if (!privateKey) {
      console.log("private key is required");
      return;
    }

    console.log("Solana Cluster:", env);
    console.log("Keypair Path:", keypair);
    console.log("RPC URL:", rpc);

    let userWalletKeypair: Keypair;
    try {
      userWalletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    } catch (e) {
      console.log('Private Key is invalid');
      console.log(e);
      return;
    }

    await setClusterConfig(env, userWalletKeypair, rpc);

    const [globalStateAddr, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_SEED)],
      solProgram.programId
    );
    const [userStateAddr, _userIx] = PublicKey.findProgramAddressSync(
      [userWalletKeypair.publicKey.toBuffer(), Buffer.from(USER_SEED)],
      solProgram.programId
    );

    console.log("globalStateAddr: ", globalStateAddr.toBase58());
    console.log("userStateAddr: ", userStateAddr.toBase58());

    const userState = await solProgram.account.userState.fetch(userStateAddr, "confirmed");
    const balanceBefore = Number(userState.tokens);

    const buyAmount = amount ? Number(amount) : 10_000_000;  //  0.01 SOL

    const tx = await solProgram.methods.buy(new BN(buyAmount))
      .accounts({
        user: userWalletKeypair.publicKey,
        vault: vaultKp.publicKey,
      })
      .signers([userWalletKeypair])
      .rpc({commitment: "confirmed"})
      .catch(e => console.log(e));

    console.log("buy with SOL tx: ", tx);

    const userStateAfter = await solProgram.account.userState.fetch(userStateAddr, "confirmed");
    const balanceAfter = Number(userStateAfter.tokens);

    console.log("bought token amout: ", balanceAfter - balanceBefore);
  });


// Buy tokens with USDC or USDT
programCommand("buy-stable")
  .option("-pk, --privateKey <string>", "user's private key")
  .option("-s, --stable <string>", "stable: 'usdt' or 'usdc'")
  .option("-a, --amount <string>", "amount with 6 decimals (1_000_000 = $1 USDC), default = 1_000_000")
  .action(async (directory, cmd) => {
    const {env, keypair, rpc, privateKey, stable, amount} = cmd.opts();

    if (!privateKey) {
      console.log("private key is required");
      return;
    }

    console.log("Solana Cluster:", env);
    console.log("Keypair Path:", keypair);
    console.log("RPC URL:", rpc);

    let userWalletKeypair: Keypair;
    try {
      userWalletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    } catch (e) {
      console.log('Private Key is invalid');
      console.log(e);
      return;
    }

    let stableKp;
    if(stable == 'usdc') {
      stableKp = usdcKp;
    } else if(stable == 'usdt') {
      stableKp = usdtKp;
    }

    if(stableKp == undefined) {
      console.log("stable coin is required");
      return;
    }

    await setClusterConfig(env, userWalletKeypair, rpc);
    const vaultPk = new PublicKey(vaultPublicAddress); // DAO address

    const [globalStateAddr, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_SEED)],
      solProgram.programId
    );
    const [userStateAddr, _userIx] = PublicKey.findProgramAddressSync(
      [userWalletKeypair.publicKey.toBuffer(), Buffer.from(USER_SEED)],
      solProgram.programId
    );
    const stableCoinUser = getAssociatedTokenAccount(userWalletKeypair.publicKey, stableKp.publicKey);
    const stableCoinVault = getAssociatedTokenAccount(vaultPk, stableKp.publicKey); // here we get DAO vault for stable

    console.log("globalStateAddr: ", globalStateAddr.toBase58());
    console.log("stableCoinUser: ", stableCoinUser.toBase58());
    console.log("stableCoinVault: ", stableCoinVault.toBase58());

    const userState = await solProgram.account.userState.fetch(userStateAddr, "confirmed");
    const balanceBefore = Number(userState.tokens);

    const buyAmount = amount ? Number(amount) : 1_000_000;  //  1 USDC

    const tx = await solProgram.methods.buyWithStableCoin(new BN(buyAmount))
      .accounts({
        user: userWalletKeypair.publicKey,
        vault: vaultPk,
        stableCoin: stableKp.publicKey,
        stableCoinUser,
        stableCoinVault
      })
      .signers([userWalletKeypair])
      .rpc({commitment: "confirmed"});

    console.log("buy with USDC tx: ", tx);

    const userStateAfter = await solProgram.account.userState.fetch(userStateAddr, "confirmed");
    const balanceAfter = Number(userStateAfter.tokens);

    console.log("bought token amout: ", balanceAfter - balanceBefore);
  });


programCommand("get-state")
  .action(async (directory, cmd) => {
    const {env, keypair, rpc} = cmd.opts(); // keypair - admin.json

    console.log("Solana Cluster:", env);
    console.log("Keypair Path:", keypair);
    console.log("RPC URL:", rpc);

    await setClusterConfig(env, keypair, rpc);

    const [globalStateAddr, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_SEED)],
      solProgram.programId
    );
    console.log("globalStateAddr: ", globalStateAddr.toBase58());

    const globalState = await solProgram.account.globalState.fetch(globalStateAddr);
    console.log("tokenSold: ", globalState.tokenSold.toNumber());
    console.log("tokenSoldUSD: ", globalState.tokenSoldUsd.toString());
    console.log("remainTokens: ", globalState.remainTokens[0].toNumber());
  });


function programCommand(name: string) {
  return program
    .command(name)
    .option(
      //  mainnet-beta, testnet, devnet
      "-e, --env <string>",
      "Solana cluster env name",
      "devnet"
    )
    .option(
      "-r, --rpc <string>",
      "Solana cluster RPC name",
      "https://api.devnet.solana.com"
    )
    .option(
      "-k, --keypair <string>",
      "Solana wallet Keypair Path",
      "admin.json"
    );
}

program.parse(process.argv);