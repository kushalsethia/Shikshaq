/**
 * STRUCTURED DATA GENERATORS
 *
 * Utility functions to generate schema.org structured data (JSON-LD)
 * for different page types across the Shikshaq website.
 *
 * Implements schemas for:
 * - ItemList (browse, subject, board pages)
 * - BreadcrumbList (navigation hierarchy)
 * - FAQPage (FAQ page)
 * - WebPage (generic pages)
 * - CollectionPage (teacher listings)
 */

const SITE_URL = 'https://www.shikshaq.in';
const ORG_ID = `${SITE_URL}/#organization`;

/**
 * Generate ItemList schema for teacher listing pages
 */
export function generateItemListSchema(params: {
  url: string;
  name: string;
  description: string;
  items: Array<{
    name: string;
    url: string;
    image?: string;
    description?: string;
  }>;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${params.url}#itemlist`,
    name: params.name,
    description: params.description,
    url: params.url,
    numberOfItems: params.items.length,
    itemListElement: params.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        '@id': item.url,
        name: item.name,
        url: item.url,
        image: item.image,
        description: item.description,
        jobTitle: 'Tutor',
        memberOf: {
          '@id': ORG_ID,
        },
      },
    })),
  };
}

/**
 * Generate CollectionPage schema for subject/board pages
 */
export function generateCollectionPageSchema(params: {
  url: string;
  name: string;
  description: string;
  about: string;
  numberOfItems: number;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${params.url}#webpage`,
    url: params.url,
    name: params.name,
    description: params.description,
    about: {
      '@type': 'Thing',
      name: params.about,
    },
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    publisher: {
      '@id': ORG_ID,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: params.numberOfItems,
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: index === breadcrumbs.length - 1 ? undefined : `${SITE_URL}${crumb.url}`,
    })),
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQPageSchema(params: {
  url: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${params.url}#faqpage`,
    url: params.url,
    mainEntity: params.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Service schema for subject offerings
 */
export function generateServiceSchema(params: {
  subject: string;
  description: string;
  areaServed?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-${params.subject.toLowerCase().replace(/\s+/g, '-')}`,
    name: `${params.subject} Tuition in Kolkata`,
    description: params.description,
    provider: {
      '@id': ORG_ID,
    },
    serviceType: 'Educational Service',
    areaServed: params.areaServed || 'Kolkata, West Bengal, India',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Free teacher discovery platform - no commission',
    },
  };
}

/**
 * Generate EducationalOccupationalProgram schema
 */
export function generateEducationalProgramSchema(params: {
  name: string;
  description: string;
  provider: string;
  subjects: string[];
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: params.name,
    description: params.description,
    provider: {
      '@id': ORG_ID,
    },
    teaches: params.subjects,
    occupationalCategory: 'Tuition Teacher',
  };
}

/**
 * Subject page schema generator
 * Combines CollectionPage, Service, and Breadcrumb schemas
 */
export function generateSubjectPageSchemas(params: {
  subject: string;
  url: string;
  description: string;
  teacherCount: number;
  breadcrumbs?: Array<{ name: string; url: string }>;
}): object[] {
  const schemas: object[] = [];

  // CollectionPage schema
  schemas.push(
    generateCollectionPageSchema({
      url: `${SITE_URL}${params.url}`,
      name: `${params.subject} Tuition Teachers in Kolkata`,
      description: params.description,
      about: `${params.subject} Tutors`,
      numberOfItems: params.teacherCount,
    })
  );

  // Service schema
  schemas.push(
    generateServiceSchema({
      subject: params.subject,
      description: params.description,
    })
  );

  // Breadcrumb schema
  if (params.breadcrumbs) {
    schemas.push(generateBreadcrumbSchema(params.breadcrumbs));
  }

  return schemas;
}

/**
 * Board page schema generator
 */
export function generateBoardPageSchemas(params: {
  board: string;
  url: string;
  description: string;
  teacherCount: number;
  breadcrumbs?: Array<{ name: string; url: string }>;
}): object[] {
  const schemas: object[] = [];

  // CollectionPage schema
  schemas.push(
    generateCollectionPageSchema({
      url: `${SITE_URL}${params.url}`,
      name: `${params.board} Tuition Teachers in Kolkata`,
      description: params.description,
      about: `${params.board} Board Tutors`,
      numberOfItems: params.teacherCount,
    })
  );

  // Service schema
  schemas.push(
    generateServiceSchema({
      subject: params.board,
      description: params.description,
    })
  );

  // Breadcrumb schema
  if (params.breadcrumbs) {
    schemas.push(generateBreadcrumbSchema(params.breadcrumbs));
  }

  return schemas;
}

/**
 * Browse page schema generator
 */
export function generateBrowsePageSchemas(params: {
  teacherCount: number;
  teachers?: Array<{
    name: string;
    slug: string;
    image?: string;
    description?: string;
  }>;
}): object[] {
  const schemas: object[] = [];

  // If specific teachers are provided, generate ItemList
  if (params.teachers && params.teachers.length > 0) {
    schemas.push(
      generateItemListSchema({
        url: `${SITE_URL}/all-tuition-teachers-in-kolkata`,
        name: 'Tuition Teachers in Kolkata',
        description: 'Browse verified tuition teachers across all subjects and boards in Kolkata',
        items: params.teachers.map((teacher) => ({
          name: teacher.name,
          url: `${SITE_URL}/tuition-teachers/${teacher.slug}`,
          image: teacher.image,
          description: teacher.description,
        })),
      })
    );
  }

  // CollectionPage schema
  schemas.push(
    generateCollectionPageSchema({
      url: `${SITE_URL}/all-tuition-teachers-in-kolkata`,
      name: 'Browse Tuition Teachers in Kolkata',
      description: 'Find and compare tuition teachers across subjects, boards, and localities in Kolkata',
      about: 'Tuition Teachers',
      numberOfItems: params.teacherCount,
    })
  );

  // Breadcrumb schema
  schemas.push(
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'All Teachers', url: '/all-tuition-teachers-in-kolkata' },
    ])
  );

  return schemas;
}

/**
 * Helper: Inject multiple schemas into page head
 */
export function injectSchemas(schemas: object[]) {
  // Remove existing schemas with id="page-schemas"
  const existing = document.getElementById('page-schemas');
  if (existing) {
    existing.remove();
  }

  // Create new script tag with all schemas
  const script = document.createElement('script');
  script.id = 'page-schemas';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schemas);
  document.head.appendChild(script);
}
