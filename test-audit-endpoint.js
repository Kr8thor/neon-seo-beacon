const http = require("http");

const testData = JSON.stringify({
  url: "https://google.com",
  type: "standard"
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/test-audit",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(testData),
    Accept: "application/json",
    "User-Agent": "Test Client 1.0", // Avoid curl user agent
  },
};

console.log("Testing Test Audit API: POST http://localhost:3000/api/test-audit");
console.log("Test URL: https://google.com");

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("\n=== TEST AUDIT RESULTS ===");
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log("Raw response:", data);
    }
  });
});

req.on("error", (error) => {
  console.error("Error:", error.message);
});

req.setTimeout(30000, () => {
  console.log("Request timeout (30s)");
  req.destroy();
});

req.write(testData);
req.end();
