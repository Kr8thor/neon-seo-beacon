const http = require("http");

const postData = JSON.stringify({
  url: "example.com",
  type: "standard",
});

const options = {
  hostname: "localhost",
  port: 3005,
  path: "/api/audits/public",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
    Accept: "application/json",
    "User-Agent": "Node.js Test Client",
  },
};

console.log(
  "Testing Audit API endpoint: http://localhost:3005/api/audits/public",
);
console.log("Request body:", postData);

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

req.write(postData);
req.end();
