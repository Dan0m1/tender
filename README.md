# App setup


## Prerequisites

- Docker installed on your machine.
- Docker Compose installed.
- Port **5433** is available for the PostgreSQL container.

### Version Requirements

1. **Check Docker version:**

   ```sh
   docker --version
   # Should output something like: Docker version 24.0.7, build afdd53b
   ```

2. **Check Docker Compose version:**

   ```sh
   # For Docker Compose V2
   docker compose version
   # Should output something like: Docker Compose version v2.21.0
   ```

### Installing/Updating Docker

1. **For Ubuntu/Debian:**

   ```sh
   # Remove old versions
   sudo apt-get remove docker docker-engine docker.io containerd runc

   # Install latest version
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

2. **For Windows/Mac:**
   - Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

3. **For other systems:**
   - Follow the [official Docker installation guide](https://docs.docker.com/engine/install/)


## Starting the app

1. **Clone the Repository**

   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Create a vaild .env file**

   You can either remove .example ending of [.env.example](https://github.com/Dan0m1/tender/blob/main/.env.example) and use it as a sample or build an own new one.
   

2. **Build and Start Services**

   ```sh
   docker compose up --build
   ```


3. **Access the Application**

   Now the app should be accessible at [http://localhost:3000](http://localhost:3000).
