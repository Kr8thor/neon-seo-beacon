const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/health",
  method: "GET",
  headers: {
    Accept: "application/json",
    "User-Agent": "Node.js Test Client",
  },
};

console.log("Testing Health API: http://localhost:3000/api/health");

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Response Body:");
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

req.setTimeout(10000, () => {
  console.log("Request timeout");
  req.destroy();
});

req.end();
