# Build stage
FROM --platform=$BUILDPLATFORM rust:1.75-slim as builder

# Set working directory
WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && apt-get install -y \
                pkg-config \
                libssl-dev \
                && rm -rf /var/lib/apt/lists/*

# Copy manifest files
COPY Cargo.toml Cargo.lock ./

# Create dummy main.rs to cache dependencies
RUN mkdir src && \
                echo "fn main() {}" > src/main.rs && \
                cargo build --release && \
                rm -rf src

# Copy actual source code
COPY src ./src

# Build for release
RUN cargo build --release

# Runtime stage
FROM --platform=$TARGETPLATFORM debian:bullseye-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
                ca-certificates \
                && rm -rf /var/lib/apt/lists/*

# Copy binary from builder
COPY --from=builder /usr/src/app/target/release/your-app-name ./

EXPOSE 8080

CMD ["./your-app-name"]