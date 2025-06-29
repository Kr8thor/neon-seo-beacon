<template>
  <div>
    <AppHeader 
      title="Security & Privacy" 
      subtitle="How we protect your data and ensure your privacy"
    />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="prose prose-lg max-w-none">
        <h2>Data Security</h2>
        <p>
          At Neon SEO Beacon, we take data security seriously. All data is encrypted 
          in transit and at rest using industry-standard encryption protocols.
        </p>
        
        <h2>Privacy Protection</h2>
        <p>
          We never share your SEO audit data with third parties. Your website analysis 
          results are private and only accessible to your account.
        </p>
        
        <h2>Compliance</h2>
        <ul>
          <li>GDPR compliant data handling</li>
          <li>SOC 2 Type II certified infrastructure</li>
          <li>Regular security audits and penetration testing</li>
          <li>Multi-factor authentication support</li>
        </ul>
        
        <h2>Data Retention</h2>
        <p>
          SEO audit results are retained for 12 months to allow for historical 
          comparison and trend analysis. You can delete your data at any time 
          through your account settings.
        </p>
        
        <h2>Contact Security Team</h2>
        <p>
          If you have security concerns or want to report a vulnerability, 
          please contact our security team at security@neonseobeacon.com
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Security & Privacy - Neon SEO Beacon',
  description: 'Learn how we protect your data and ensure privacy'
})
</script>
