import { request as httpsRequest } from "https";
import { request as httpRequest } from "http";

export const getWithBody = (url: string, body: Record<string, unknown>) =>
  new Promise<unknown>((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === "http:" ? httpRequest : httpsRequest;
    const payload = JSON.stringify(body);

    const req = client(
      {
        hostname: parsed.hostname,
        port: parsed.port || undefined,
        path: `${parsed.pathname}${parsed.search}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("Invalid JSON response from server"));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
