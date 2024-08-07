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

pub const NUM_STAGES: u8 = 14;

//  stage data: stage_num, price, amounts
pub struct Stage {
    pub index: u8,
    pub price: u64,
    pub amount: u64,
}

// token price with 6 decimals
pub const STAGES: [Stage; 14] = [
    Stage { index: 1,  price: 300, amount:  111_110_000 }, // $0.0003
    Stage { index: 2,  price: 500, amount:  199_998_000 }, // $0.0005
    Stage { index: 3,  price: 700, amount:  317_460_000 }, // $0.0007
    Stage { index: 4,  price: 900, amount: 493_826_667 }, // $0.0009
    Stage { index: 5,  price: 1100, amount: 606_060_000 }, // $0.0011
    Stage { index: 6,  price: 1300, amount: 512_820_000 }, // $0.0013
    Stage { index: 7,  price: 1500, amount:  444_444_000 }, // $0.0015
    Stage { index: 8, price: 1700, amount:  392_156_471 }, // $0.0017
    Stage { index: 9, price: 1900, amount:  350_876_842 }, // $0.0019
    Stage { index: 10, price: 2100, amount:  317_460_000 }, // $0.0021
    Stage { index: 11, price: 2300, amount:  193_236_522 }, // $0.0023
    Stage { index: 12, price: 2500, amount:  44_444_400 }, // $0.0025
    Stage { index: 13, price: 2700, amount:  12_345_556 }, // $0.0027
    Stage { index: 14, price: 0, amount:  0 }, // zero stage for finishing presale
];

pub const TOKEN_DECIMALS: u64 = 1_000_000;


// pub const SOL_USD_FEED: Pubkey = pubkey!("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"); //  pyth price feed on solana mainnet-beta
pub const SOL_USD_FEED: Pubkey = pubkey!("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"); //  pyth price feed on solana devnet
pub const STALENESS_THRESHOLD: u64 = 60; // staleness threshold in seconds
