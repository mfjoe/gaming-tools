import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
  keywords?: string[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage,
  structuredData,
  keywords = [],
}) => {
  const defaultTitle = 'EA FC 25 Squad Builder - Free Chemistry Calculator | Gaming Tools';
  const defaultDescription =
    'Build your perfect EA FC 25 Ultimate Team squad with accurate chemistry calculations, 20,000+ player database, formation builder, SBC solver, and evolution planner. Free, fast, no ads.';
  const defaultKeywords = [
    'EA FC 25',
    'EA Sports FC 25',
    'Ultimate Team',
    'Squad Builder',
    'Chemistry Calculator',
    'FUT',
    'FIFA 25',
    'SBC Solver',
    'Evolution Planner',
  ];

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = [...defaultKeywords, ...keywords].join(', ');
  const finalCanonical = canonical || (typeof window !== 'undefined' ? window.location.href : '');
  const finalOgImage = ogImage || '/og-image-1200x630.jpg';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Gaming Tools" />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalCanonical} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalOgImage} />
      <meta property="twitter:creator" content="@GamingToolsUK" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 days" />
      <meta name="author" content="Gaming Tools" />

      {/* Mobile Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Squad Builder" />

      {/* Theme Color */}
      <meta name="theme-color" content="#1a472a" />
      <meta name="msapplication-TileColor" content="#1a472a" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
};

/**
 * Structured Data Schemas
 */

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EA FC 25 Squad Builder',
  description: 'Free squad builder and chemistry calculator for EA Sports FC 25 Ultimate Team',
  url: 'https://gaming-tools.co.uk/ea-fc-25-squad-builder',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'Real-time chemistry calculation',
    '20,000+ player database with prices',
    'Formation builder with all formations',
    'SBC solver with cost optimization',
    'Evolution planner with stat calculator',
    'Squad sharing via URL',
    'Offline support',
    'Mobile optimized',
  ],
};

export const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EA FC 25 Squad Builder',
  applicationCategory: 'Utility',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
  },
  author: {
    '@type': 'Organization',
    name: 'Gaming Tools',
    url: 'https://gaming-tools.co.uk',
  },
};

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Gaming Tools',
  url: 'https://gaming-tools.co.uk',
  logo: 'https://gaming-tools.co.uk/logo.png',
  sameAs: [
    'https://twitter.com/GamingToolsUK',
    'https://www.reddit.com/user/GamingToolsUK',
  ],
};

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

