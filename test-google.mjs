// Test SEO Analysis API with Google
const testURL = 'http://localhost:3000/api/seo/analyze';
const payload = {
  url: 'https://google.com',
  options: {
    includeImages: true,
    checkMobile: true,
    includePerformance: true
  }
};

console.log('Testing SEO Analysis API with Google.com...');

try {
  const response = await fetch(testURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  console.log('Response Status:', response.status);
  
  if (response.ok) {
    const result = await response.json();
    console.log('\n✅ SEO Analysis SUCCESS!');
    console.log('URL:', result.data?.url);
    console.log('Title:', result.data?.title);
    console.log('SEO Score:', result.data?.score + '/100');
    console.log('Processing Time:', result.data?.processingTime + 'ms');
    console.log('Images Found:', result.data?.images?.total);
    console.log('Links Found:', result.data?.links?.total);
  } else {
    const error = await response.text();
    console.log('\n❌ Error:', error);
  }
} catch (error) {
  console.error('\n❌ Request Failed:', error.message);
}
