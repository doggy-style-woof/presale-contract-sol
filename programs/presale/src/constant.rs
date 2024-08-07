use solana_program::{pubkey, pubkey::Pubkey};

//  seeds
pub const GLOBAL_SEED: &[u8] = b"presale-global";
pub const USER_SEED: &[u8] = b"presale-user";

//  address of stable coins
// pub const USDC_ADDRESS: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
// pub const USDT_ADDRESS: Pubkey = pubkey!("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");

//  devnet/test addresses
pub const USDC_ADDRESS: Pubkey = pubkey!("DCwFVTqkanjVJKwJ4rPprH4y8XzkFmqtHgFavF92MUud");
pub const USDT_ADDRESS: Pubkey = pubkey!("8GwuKqJigGFGBeQ2GMjxXdvj9WwbvHGTPkxykk424XP2");

pub const NUM_STAGES: u8 = 9;

//  stage data: stage_num, price, amounts
pub struct Stage {
    pub index: u8,
    pub price: u64,
    pub amount: u64,
}

// token price with 6 decimals
pub const STAGES: [Stage; 9] = [
    Stage { index: 1,  price: 20_000, amount:  1_000_000 }, // $0.02
    Stage { index: 2,  price: 30_000, amount:  2_000_000 }, // $0.03
    Stage { index: 3,  price: 40_000, amount:  3_000_000 }, // $0.04
    Stage { index: 4,  price: 50_000, amount: 4_000_000 }, // $0.05
    Stage { index: 5,  price: 60_000, amount: 5_000_000 }, // $0.06
    Stage { index: 6,  price: 70_000, amount: 6_000_000 }, // $0.07
    Stage { index: 7,  price: 80_000, amount:  7_000_000 }, // $0.08
    Stage { index: 8, price: 90_000, amount:  8_000_000 }, // $0.09
    Stage { index: 9, price: 0, amount:  0 }, // zero stage for finishing presale
];

pub const TOKEN_DECIMALS: u64 = 1_000_000;


// pub const SOL_USD_FEED: Pubkey = pubkey!("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"); //  pyth price feed on solana mainnet-beta
pub const SOL_USD_FEED: Pubkey = pubkey!("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"); //  pyth price feed on solana devnet
pub const STALENESS_THRESHOLD: u64 = 60; // staleness threshold in seconds
