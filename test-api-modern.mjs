// Test SEO Analysis API
const testURL = 'http://localhost:3000/api/seo/analyze';
const payload = {
  url: 'https://example.com',
  options: {
    includeImages: true,
    checkMobile: true,
    includePerformance: true
  }
};

console.log('Testing SEO Analysis API...');
console.log('URL:', testURL);
console.log('Payload:', JSON.stringify(payload, null, 2));

try {
  const response = await fetch(testURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  console.log('\nResponse Status:', response.status);
  
  if (response.ok) {
    const result = await response.json();
    console.log('\nSEO Analysis Result:');
    console.log('Success:', result.success);
    if (result.data) {
      console.log('URL Analyzed:', result.data.url);
      console.log('SEO Score:', result.data.score);
      console.log('Processing Time:', result.data.processingTime + 'ms');
      console.log('Title:', result.data.title);
    }
  } else {
    const error = await response.text();
    console.log('\nError Response:', error);
  }
} catch (error) {
  console.error('\nRequest Failed:', error.message);
}
