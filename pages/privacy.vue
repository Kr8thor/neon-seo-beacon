<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div class="prose prose-lg max-w-none">
          <p class="text-gray-600 mb-6">
            <strong>Last updated:</strong> {{ new Date().toLocaleDateString() }}
          </p>

          <h2>1. Information We Collect</h2>
          <h3>Account Information</h3>
          <ul>
            <li>Email address (for account creation and communication)</li>
            <li>Password (encrypted and stored securely)</li>
            <li>Profile information you choose to provide</li>
          </ul>

          <h3>Usage Data</h3>
          <ul>
            <li>Websites you submit for SEO analysis</li>
            <li>Audit results and performance metrics</li>
            <li>Service usage patterns and preferences</li>
          </ul>

          <h3>Technical Data</h3>
          <ul>
            <li>IP address and browser information</li>
            <li>Device type and operating system</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and improve our SEO audit services</li>
            <li>Communicate with you about your account and our services</li>
            <li>Analyze and improve our platform performance</li>
            <li>Ensure security and prevent fraud</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information in these limited circumstances:</p>
          <ul>
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With service providers who assist our operations (under strict confidentiality agreements)</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>We implement industry-standard security measures including:</p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Secure hosting with trusted providers</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide services. 
            You may request deletion of your data at any time.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and update your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of communications</li>
            <li>Export your data</li>
          </ul>

          <h2>7. Cookies and Tracking</h2>
          <p>
            We use cookies to improve your experience and analyze usage patterns. 
            You can control cookie settings through your browser preferences.
          </p>

          <h2>8. Third-Party Services</h2>
          <p>Our service integrates with:</p>
          <ul>
            <li>Supabase (database and authentication)</li>
            <li>Anthropic Claude (AI-powered analysis)</li>
            <li>Google Analytics (usage analytics)</li>
          </ul>

          <h2>9. International Data Transfers</h2>
          <p>
            Your data may be processed in countries outside your residence. 
            We ensure appropriate safeguards are in place for international transfers.
          </p>

          <h2>10. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13. 
            We do not knowingly collect personal information from children.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this privacy policy periodically. 
            We will notify you of significant changes via email or service notifications.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            For privacy-related questions or requests:
            <a href="mailto:privacy@mardenseo.com" class="text-blue-600 hover:underline">privacy@mardenseo.com</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page metadata
useHead({
  title: 'Privacy Policy - Neon SEO Beacon',
  meta: [
    {
      name: 'description',
      content: 'Privacy Policy for Neon SEO Beacon - Learn how we protect and use your data.'
    },
    { name: 'robots', content: 'noindex' }
  ]
})
</script>
