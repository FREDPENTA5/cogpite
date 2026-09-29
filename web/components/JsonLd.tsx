export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cogpite',
    url: 'https://cogpite.com',
    logo: 'https://cogpite.com/logo-stacked.svg',
    description: 'AI-powered procurement intelligence platform helping East African ICT firms discover, track, and win government tenders.',
    foundingDate: '2024',
    founders: [{ '@type': 'Person', name: 'Cogpite Team' }],
    sameAs: [
      'https://twitter.com/cogpite',
      'https://linkedin.com/company/cogpite',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UG',
      addressRegion: 'Kampala',
    },
    areaServed: [
      { '@type': 'Country', name: 'Uganda' },
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'Country', name: 'Rwanda' },
      { '@type': 'Country', name: 'Tanzania' },
    ],
    knowsAbout: [
      'Government Procurement',
      'RFP Intelligence',
      'Tender Management',
      'AI-Powered Procurement',
      'East African ICT Sector',
      'PPDA Uganda',
      'PPOA Kenya',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function SoftwareApplicationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cogpite',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://cogpite.com',
    description: 'AI-powered RFP intelligence platform that scrapes government procurement portals across East Africa and delivers matching tenders to ICT firms.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available',
    },
    featureList: [
      'Real-time RFP monitoring from PPDA, PPOA, RPPA',
      'AI-powered tender matching and categorization',
      'Custom alert rules and notifications',
      'Budget estimation and complexity analysis',
      'Multi-country procurement tracking',
      'Saved searches and bookmarks',
    ],
    screenshot: 'https://cogpite.com/og-image.png',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cogpite',
    url: 'https://cogpite.com',
    description: 'AI-powered procurement intelligence for East African ICT firms',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://cogpite.com/dashboard?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const data = {
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
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
