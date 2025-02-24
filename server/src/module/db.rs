use mongodb::{options::ClientOptions, Client};
use std::error::Error;
use config;

async fn connect_to_mongodb() -> Result<Client, Box<dyn Error>> {
    // Parse a connection string into an options struct.
    let client_options = ClientOptions::parse(config.db_url).await?;
    
    // Get a handle to the deployment.
    let client = Client::with_options(client_options)?;

    // Ping the server to see if you can connect to the cluster
    client
        .database("admin")
        .run_command(doc! {"ping": 1}, None)
        .await?;

    println!("Connected to MongoDB!");

    Ok(client)
}
