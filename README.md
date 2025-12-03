# Directorybuilder

Directorybuilder is a full-stack tool for generating standardized project folder structures. The React client guides users through picking an artist type and project details, while the Express server validates the payload, generates an archive, and serves the downloadable ZIP.

## Prerequisites
- Docker / Container Station with Docker CLI access (QNAP includes this once Container Station is installed)
- Git or another method to copy the project files onto your NAS

## Quick start (any Docker host)
1. Build the image:
   ```bash
   docker build -t directorybuilder .
   ```
2. Run the container (default port 9090):
   ```bash
   docker run -d --name directorybuilder -p 9090:9090 --restart unless-stopped directorybuilder
   ```
3. Open `http://<host-ip>:9090` in your browser and use the app.

### Changing the port
The server reads `PORT` (default `9090`). To use a different port (e.g., `8080`):
```bash
docker run -d --name directorybuilder -e PORT=8080 -p 8080:8080 --restart unless-stopped directorybuilder
```

## QNAP NAS setup via SSH
1. **SSH into the NAS** using an admin account: `ssh admin@<nas-ip>`.
2. **Clone or copy the project** into a writable directory (e.g., `~/Directorybuilder`).
3. **Build the image** inside that directory:
   ```bash
   docker build -t directorybuilder .
   ```
4. **Start the container** on an available port (using 9090 here):
   ```bash
   docker run -d --name directorybuilder \
     -p 9090:9090 \
     --restart unless-stopped \
     directorybuilder
   ```
   - If 9090 is taken, set `-e PORT=XXXX` and match the published port: `-p XXXX:XXXX`.
5. **Verify it is running**:
   ```bash
   docker ps --filter name=directorybuilder
   docker logs -f directorybuilder
   ```
6. **Access the UI** from your LAN at `http://<nas-ip>:<port>`.
7. **Update or restart later**:
   ```bash
   docker stop directorybuilder && docker rm directorybuilder
   docker build -t directorybuilder .
   docker run -d --name directorybuilder -p 9090:9090 --restart unless-stopped directorybuilder
   ```

## Notes
- The build bundles the client and server; no external database is required.
- The container stores generated ZIPs in-memory for the session; downloads are streamed directly to the requesting browser.
