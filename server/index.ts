import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { spawn } from "child_process";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Start Service A (Python Flask)
const serviceA = spawn("python", ["services/service_a/src/main.py"], {
  stdio: "inherit",
  env: {
    ...process.env,
    PYTHONPATH: process.cwd()
  }
});

serviceA.on("error", (error) => {
  console.error("Failed to start Service A:", error);
});

// Start Service B (Node.js)
const serviceB = spawn("tsx", ["services/service-b/src/server.ts"], {
  stdio: "inherit",
});

serviceB.on("error", (error) => {
  console.error("Failed to start Service B:", error);
});

// Start Service C (.NET)
const serviceC = spawn("dotnet", ["run", "--project", "services/service-c/ServiceC.Api/ServiceC.Api.csproj"], {
  stdio: "inherit",
});

serviceC.on("error", (error) => {
  console.error("Failed to start Service C:", error);
});

serviceC.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Service C exited with code ${code}`);
  }
});

(async () => {
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });

  // Cleanup on exit
  process.on("SIGTERM", () => {
    serviceA.kill();
    serviceB.kill();
    serviceC.kill();
    process.exit(0);
  });
})();