# Spl token presale smart contract


## Install Dependencies

- Install `node` and `yarn`

- Install `rust`, `solana` and `anchor`

    https://www.anchor-lang.com/docs/installation

- Prepare solana wallet for the test

    ```
    solana-keygen new -o admin.json
    ```

    Airdrop/Transfer SOL to this test wallet.

<br/>

## How to deploy this program?

First of all, you have to clone this repo to your PC.
In the folder `token-presale`

1. Install node modules using `yarn`

2. Build program using anchor cli `anchor build`

3. Get program address using solana cli.

    `solana-keygen pubkey ./target/deploy/presale-keypair.json`
   
   You can get the pubkey of the program. e.g. `BE4G...5qhv`

4. Change program address in the code to `BE4G...5qhv`

   in `lib.rs`
   ```
   declare_id!("BE4G...5qhv");
   ```
   in `Anchor.toml`
   ```
   presale = "BE4G...5qhv"
   ```

5. Change provider settings in `Anchor.toml`
   ```
   cluster = "localnet"
   wallet = "./admin.json"
   ```

6. run `anchor build` again

7. deploy program using anchor cli `anchor deploy`

<br/>

## Usage

### Test project

./tests/presal.ts is test script for each instruction


run `anchor test` to check test the smart contract

### Test on devnet

You should build and deploy on devnet first.

Check the program address and USDC, USDT address.

## CLI Commands

**Warning!** Set `vaultPublicAddress` in cli/command,ts before running the commands.

```bash
# Initialise contract (set global state and admin)
yarn script init

# Deploy USDT/USDC and mint it to random user
yarn script deploy-stablecoins -u <wallet-user>

# Set vault (dao) for collecting money & generate account addresses on stablecoins' contracts
yarn script set-vault -v <dao-wallet>

# Start presale
yarn script start-presale

# Generate user state on Presale contract (PDA for user with user's data)
yarn script user-state -pk <your-private-key>

# Buy tokens with SOL (example with 0.05 SOL)
yarn script buy -pk <your-private-key> -a 50_000_000

# Buy tokens with USDC (example with $2 usdc)
yarn script buy-stable -pk <your-private-key> -s usdc -a 2_000_000

# (OPTIONAL) Update Stage
yarn script set-stage -s 1
```