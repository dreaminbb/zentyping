use mongodb::{bson::doc, Client, Collection};
use std::error::Error;

//"id": 21,
//"lang": "python",
//"url": "https://www.github.com/",
//"code": "def add(a, b):\n    return a + b\n\nprint(add(5, 3))"

struct CodeDataType {
    id: i32,
    lang: String,
    url: String,
    code: String,
}

// This function read collection data from json file and return it as a object
pub async fn read_collection_data() -> Result<Vec<serde_json::Value>, Box<dyn Error>> {
    let data = tokio::fs::read_to_string("src/python.json").await?;
    let data: Vec<serde_json::Value> = serde_json::from_str(&data)?;
    return Ok(data);
}

fn main() -> Result<(), Box<dyn Error>> {
    let data = tokio::runtime::Runtime::new()
        .unwrap()
        .block_on(read_collection_data())?;

    // connect to db
    let client = Client::with_uri_str("mongodb://localhost:27017");
    let db = client.database("zentyping");
    let collection: Collection<CodeDataType> = db.collection("python_code");

    println!("接続成功");

    for i in 0..data.len() {
        print!("{}\n", data[i]);
    }

    Ok(())
}
