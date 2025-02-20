use dotenv::dotenv;
use std::env;

pub struct Config {
    pub domain: String,
    pub db_url: String,
    pub port: u16,
}

impl Config {
    pub fn from_env() -> Self {
        // load the .env file
        dotenv().ok();

        let db_url =
            env::var("DATABASE_URL").unwrap_or_else(|_| "postgres://localhost".to_string());

        let port = env::var("PORT")
            .unwrap_or_else(|_| "8000".to_string())
            .parse()
            .expect("PORT must be a number");

        let domain = env::var("DOMAIN").unwrap_or_else(|_| "not found".to_string());

        Config {
            domain,
            db_url,
            port,
        }
    }
}
