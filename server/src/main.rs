use actix_files::{Files, NamedFile};
use actix_web::{middleware, App, HttpServer};
use std::path::PathBuf;

#[actix_web::get("/")]
async fn server_index() -> actix_web::Result<NamedFile> {
    println!("Serving index.html"); // Changed to println! for better logging
    let path = PathBuf::from("./static/index.html");
    Ok(NamedFile::open(path)?)
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let port = 8000;
    // let bebug = true;
    env_logger::init();

    println!("Server started at http://localhost:{}", port);

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
    .bind(("127.0.0.1", port))?
    .workers(4)
    .run()
    .await
}