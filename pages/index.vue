<template>
  <div>
    <!-- Fast Landing Page Component -->
    <FastLandingPage />
  </div>
</template>

<script setup>
const { setPageMeta, generateWebsiteSchema, generateOrganizationSchema } =
  useSEO();

// SEO
setPageMeta({
  title:
    "Free SEO Audit Tool | Professional Website Analysis | Marden SEO Audit",
  description:
    "Get a comprehensive SEO audit of your website in under 60 seconds with Marden SEO Audit. AI-powered analysis with actionable recommendations to improve your search rankings. No registration required.",
  keywords:
    "free SEO audit, website analysis, SEO score, search engine optimization, SEO tools, technical SEO, SEO checker, website audit, Marden SEO",
});

// Structured data
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(generateWebsiteSchema()),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify(generateOrganizationSchema()),
    },
  ],
});
</script>
