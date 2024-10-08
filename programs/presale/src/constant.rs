use solana_program::{pubkey, pubkey::Pubkey};

//  seeds
pub const GLOBAL_SEED: &[u8] = b"presale-global";
pub const USER_SEED: &[u8] = b"presale-user";

//  address of stable coins
// pub const USDC_ADDRESS: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
// pub const USDT_ADDRESS: Pubkey = pubkey!("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");

//  test addresses
pub const USDC_ADDRESS: Pubkey = pubkey!("BBUMhTAqLaHve46g2Fwch2nCLHxFDDidHfXJAX67spw");
pub const USDT_ADDRESS: Pubkey = pubkey!("HMQAPK9tCycrmckrV9KayFtgja8Jvib8GcjQkpLcxbze");

pub const NUM_STAGES: u8 = 14;

//  stage data: stage_num, price, amounts
pub struct Stage {
    pub index: u8,
    pub price: u64,
    pub amount: u64,
}

pub const STAGES: [Stage; 14] = [
    Stage { index: 1,  price: 300, amount:  111_110_000 }, // $0.0003
    Stage { index: 2,  price: 500, amount:  155_554_000 }, // $0.0005
    Stage { index: 3,  price: 700, amount:  317_460_000 }, // $0.0007
    Stage { index: 4,  price: 900, amount:  370_370_000 }, // $0.0009
    Stage { index: 5,  price: 1100, amount:  505_050_000 }, // $0.0011
    Stage { index: 6,  price: 1300, amount:  598_290_000 }, // $0.0013
    Stage { index: 7,  price: 1500, amount:  518_518_000 }, // $0.0015
    Stage { index: 8, price: 1700, amount:  457_515_882 }, // $0.0017
    Stage { index: 9, price: 1900, amount:  409_356_316 }, // $0.0019
    Stage { index: 10, price: 2100, amount:  370_370_000 }, // $0.0021
    Stage { index: 11, price: 2300, amount:  144_927_391 }, // $0.0023
    Stage { index: 12, price: 2500, amount:  31_110_800 }, // $0.0025
    Stage { index: 13, price: 2700, amount:  12_345_556 }, // $0.0027
    Stage { index: 14, price: 0, amount:  0 }, // zero stage for finishing presale
];

pub const TOKEN_DECIMALS: u64 = 1_000_000;

//  pyth price feed on solana mainnet-beta
// pub const SOL_USD_FEED: Pubkey = pubkey!("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG");

//  pyth price feed on solana devnet
pub const SOL_USD_FEED: Pubkey = pubkey!("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");

pub const STALENESS_THRESHOLD: u64 = 60; // staleness threshold in seconds
