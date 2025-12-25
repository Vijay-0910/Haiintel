import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Custom middleware to serve pre-compressed files
app.use((req, res, next) => {
  const acceptEncoding = req.headers["accept-encoding"] || "";
  let filePath = req.path === "/" ? "/index.html" : req.path;

  // Don't compress already compressed files or images
  if (filePath.match(/\.(jpg|jpeg|png|gif|webp|gz|br)$/)) {
    return next();
  }

  const fullPath = join(__dirname, "dist", filePath);

  // Try to serve pre-compressed brotli file first (best compression)
  if (acceptEncoding.includes("br") && existsSync(fullPath + ".br")) {
    try {
      const content = readFileSync(fullPath + ".br");
      res.set("Content-Encoding", "br");
      res.set("Content-Type", getContentType(filePath));
      res.set("Cache-Control", getCacheControl(filePath));
      res.set("Vary", "Accept-Encoding");
      return res.send(content);
    } catch (err) {
      // Fall through to next option
    }
  }

  // Try to serve pre-compressed gzip file
  if (acceptEncoding.includes("gzip") && existsSync(fullPath + ".gz")) {
    try {
      const content = readFileSync(fullPath + ".gz");
      res.set("Content-Encoding", "gzip");
      res.set("Content-Type", getContentType(filePath));
      res.set("Cache-Control", getCacheControl(filePath));
      res.set("Vary", "Accept-Encoding");
      return res.send(content);
    } catch (err) {
      // Fall through to uncompressed
    }
  }

  next();
});

// Serve static files from dist (for uncompressed files and images)
app.use(
  express.static(join(__dirname, "dist"), {
    maxAge: "1y",
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      res.set("Cache-Control", getCacheControl(path));
      // Don't try to compress images or already compressed files
      if (!path.match(/\.(jpg|jpeg|png|gif|webp|gz|br)$/)) {
        res.set("Vary", "Accept-Encoding");
      }
    },
  })
);

// SPA fallback - serve index.html for all routes
app.use((req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 Serving compressed files from dist/`);
});

function getContentType(path) {
  // Remove .gz or .br extension for detection
  const cleanPath = path.replace(/\.(gz|br)$/, "");

  if (cleanPath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (cleanPath.endsWith(".css")) return "text/css; charset=utf-8";
  if (cleanPath.endsWith(".html")) return "text/html; charset=utf-8";
  if (cleanPath.endsWith(".json")) return "application/json";
  if (cleanPath.endsWith(".svg")) return "image/svg+xml";
  if (cleanPath.endsWith(".jpg") || cleanPath.endsWith(".jpeg"))
    return "image/jpeg";
  if (cleanPath.endsWith(".png")) return "image/png";
  if (cleanPath.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

function getCacheControl(path) {
  // Cache static assets for 1 year
  if (path.match(/\.(js|css|jpg|jpeg|png|gif|svg|webp|woff2?)$/)) {
    return "public, max-age=31536000, immutable";
  }
  // Cache HTML for 5 minutes
  if (path.endsWith(".html")) {
    return "public, max-age=300, must-revalidate";
  }
  return "public, max-age=3600";
}
