export const useSEO = () => {
  const config = useRuntimeConfig();

  // Generate structured data for articles
  const generateArticleSchema = (article) => {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      author: {
        "@type": "Person",
        name: article.author || "Neon SEO Team",
      },
      publisher: {
        "@type": "Organization",
        name: "Neon SEO Beacon",
        logo: {
          "@type": "ImageObject",
          url: `${config.public.siteUrl}/logo.png`,
        },
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      image: article.image
        ? `${config.public.siteUrl}${article.image}`
        : undefined,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${config.public.siteUrl}${article._path}`,
      },
      keywords: article.tags?.join(", "),
    };
  };

  // Generate FAQ schema
  const generateFAQSchema = (faqs) => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  };

  // Generate breadcrumb schema
  const generateBreadcrumbSchema = (breadcrumbs) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.title,
        item: `${config.public.siteUrl}${crumb.to}`,
      })),
    };
  };

  // Generate organization schema
  const generateOrganizationSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Neon SEO Beacon",
      url: config.public.siteUrl,
      logo: `${config.public.siteUrl}/logo.png`,
      description:
        "Professional SEO audit tool with AI-powered insights for agencies and businesses.",
      sameAs: [
        "https://twitter.com/neonseobeacon",
        "https://linkedin.com/company/neonseobeacon",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-555-0123",
        contactType: "customer service",
        availableLanguage: "English",
      },
    };
  };

  // Generate website schema
  const generateWebsiteSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Neon SEO Beacon",
      url: config.public.siteUrl,
      description: "Professional SEO audit tool with AI-powered insights.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${config.public.siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };
  };

  // Generate product schema for SaaS
  const generateSoftwareApplicationSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Neon SEO Beacon",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      description:
        "Professional SEO audit tool with AI-powered insights for agencies and businesses.",
      url: config.public.siteUrl,
      provider: {
        "@type": "Organization",
        name: "Neon SEO Beacon",
      },
      offers: {
        "@type": "Offer",
        price: "49",
        priceCurrency: "USD",
        priceValidUntil: "2025-12-31",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "127",
      },
    };
  };

  // Set page meta tags
  const setPageMeta = ({
    title,
    description,
    keywords,
    image,
    type = "website",
    publishedAt,
    updatedAt,
    author,
    section,
  }) => {
    const meta = [
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      {
        property: "og:url",
        content: `${config.public.siteUrl}${useRoute().path}`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ];

    if (keywords) {
      meta.push({ name: "keywords", content: keywords });
    }

    if (image) {
      const imageUrl = image.startsWith("http")
        ? image
        : `${config.public.siteUrl}${image}`;
      meta.push(
        { property: "og:image", content: imageUrl },
        { name: "twitter:image", content: imageUrl },
      );
    }

    if (type === "article") {
      if (publishedAt)
        meta.push({ property: "article:published_time", content: publishedAt });
      if (updatedAt)
        meta.push({ property: "article:modified_time", content: updatedAt });
      if (author) meta.push({ property: "article:author", content: author });
      if (section) meta.push({ property: "article:section", content: section });
    }

    useHead({
      title,
      meta,
      link: [
        {
          rel: "canonical",
          href: `${config.public.siteUrl}${useRoute().path}`,
        },
      ],
    });
  };

  // Generate robots meta tag
  const setRobotsMeta = (
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false,
  ) => {
    const directives = [];

    directives.push(index ? "index" : "noindex");
    directives.push(follow ? "follow" : "nofollow");

    if (noarchive) directives.push("noarchive");
    if (nosnippet) directives.push("nosnippet");

    useHead({
      meta: [{ name: "robots", content: directives.join(", ") }],
    });
  };

  return {
    generateArticleSchema,
    generateFAQSchema,
    generateBreadcrumbSchema,
    generateOrganizationSchema,
    generateWebsiteSchema,
    generateSoftwareApplicationSchema,
    setPageMeta,
    setRobotsMeta,
  };
};
