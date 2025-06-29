<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div class="prose prose-lg max-w-none">
          <p class="text-gray-600 mb-6">
            <strong>Last updated:</strong> {{ new Date().toLocaleDateString() }}
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Neon SEO Beacon ("Service"), you accept and
            agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily access and use the Service for
            personal, non-commercial transitory viewing only.
          </p>

          <h2>3. Service Description</h2>
          <p>
            Neon SEO Beacon is an AI-powered SEO audit platform that analyzes
            websites and provides optimization recommendations.
          </p>

          <h2>4. User Accounts</h2>
          <ul>
            <li>
              You must provide accurate and complete registration information
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account
            </li>
            <li>
              You must notify us immediately of unauthorized use of your account
            </li>
          </ul>

          <h2>5. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Transmit malicious code or content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the service for any unlawful purpose</li>
          </ul>

          <h2>6. Privacy Policy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy,
            which also governs your use of the Service.
          </p>

          <h2>7. Service Availability</h2>
          <p>
            We strive to maintain 99.9% uptime but cannot guarantee
            uninterrupted service availability.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            The Service is provided "as is" without warranties of any kind. We
            shall not be liable for any indirect, incidental, or consequential
            damages.
          </p>

          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior
            notice, for conduct that we believe violates these Terms.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Changes will
            be effective immediately upon posting.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            Questions about the Terms of Service should be sent to:
            <a
              href="mailto:legal@mardenseo.com"
              class="text-blue-600 hover:underline"
              >legal@mardenseo.com</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page metadata
useHead({
  title: "Terms of Service - Neon SEO Beacon",
  meta: [
    {
      name: "description",
      content:
        "Terms of Service for Neon SEO Beacon - AI-powered SEO audit platform.",
    },
    { name: "robots", content: "noindex" },
  ],
});
</script>
