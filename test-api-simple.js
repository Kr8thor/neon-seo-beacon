import axios from 'axios';

// Test the health API
async function testHealthAPI() {
  try {
    console.log('Testing Health API...');
    
    const response = await axios.get('http://localhost:3003/api/health');
    
    console.log('✅ Health API Success!');
    console.log('Status:', response.data.status);
    console.log('Database:', response.data.checks.database.status);
    console.log('AI:', response.data.checks.ai.status);
    
    return true;
  } catch (error) {
    if (error.response && error.response.status === 503) {
      // 503 is expected when there are warnings - still working but degraded
      console.log('⚠️ Health API Warning (503 expected):');
      console.log('Status:', error.response.data.status);
      console.log('Database:', error.response.data.checks.database.status);
      console.log('AI:', error.response.data.checks.ai.status);
      console.log('Memory:', error.response.data.checks.memory.status);
      console.log('Queue:', error.response.data.checks.queue.status);
      
      // Check if core systems are working
      const dbOk = error.response.data.checks.database.status !== 'unhealthy';
      const aiOk = error.response.data.checks.ai.status !== 'unhealthy';
      
      if (dbOk && aiOk) {
        console.log('✅ Core systems operational (warnings are acceptable)');
        return true;
      }
    }
    
    console.error('❌ Health API Failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
  }
}

// Test the SEO analysis API
async function testSEOAnalysis() {
  try {
    console.log('Testing SEO Analysis API...');
    
    const response = await axios.post('http://localhost:3003/api/seo/analyze', {
      url: 'https://google.com',
      options: {
        includeImages: true,
        checkMobile: true,
        includePerformance: true
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ SEO Analysis API Success!');
    console.log('Score:', response.data.data.score);
    console.log('Title:', response.data.data.title);
    console.log('Images found:', response.data.data.images.total);
    console.log('Links found:', response.data.data.links.total);
    console.log('Processing time:', response.data.data.processingTime + 'ms');
    
    return true;
  } catch (error) {
    console.error('❌ SEO Analysis API Failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  const healthSuccess = await testHealthAPI();
  console.log('');
  
  if (healthSuccess) {
    const seoSuccess = await testSEOAnalysis();
    console.log('');
    
    if (healthSuccess && seoSuccess) {
      console.log('🎉 All tests passed! The Neon SEO Beacon APIs are working!');
      console.log('🚀 Ready for Railway deployment!');
      process.exit(0);
    }
  }
  
  console.log('❌ Some tests failed. Check the logs above.');
  process.exit(1);
}

runTests();
