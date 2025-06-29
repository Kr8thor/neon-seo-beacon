const https = require("http");

const options = {
  hostname: "localhost",
  port: 3005,
  path: "/api/debug/users",
  method: "GET",
  headers: {
    Accept: "application/json",
    "User-Agent": "Node.js Test Client",
  },
};

console.log("Testing API endpoint: http://localhost:3005/api/debug/users");

const req = https.request(options, (res) => {
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
      console.log(data);
    }
  });
});

req.on("error", (error) => {
  console.error("Error:", error.message);
});

req.end();
