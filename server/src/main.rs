use actix_files::{Files, NamedFile};
use actix_web::{middleware, App, HttpServer};
use std::path::PathBuf;

// import config module from ../config.rs
mod config;

#[actix_web::get("/")]
async fn server_index() -> actix_web::Result<NamedFile> {
    println!("Serving index.html"); // Changed to println! for better logging
    let path = PathBuf::from("../static/index.html");
    Ok(NamedFile::open(path)?)
}

// this api point returns code data type is json
#[actix_web::get("/code")]
async fn send_code_to_client() -> actix_web::Result<actix_web::HttpResponse> {

}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let config = config::Config::from_env();
    env_logger::init();

    println!("Server started at http://localhost:{}", config.port);
    println!("The db url is {}", config.db_url);
    println!("Domein is {}", config.domain);

    HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .service(server_index)
            .service(
                Files::new("/assets", "./static/assets")
                    .show_files_listing()
                    .use_last_modified(true),
            )
    })
    .bind(("127.0.0.1", config.port))?
    .workers(4)
    .run()
    .await
}
