/**
 * 结构化数据（JSON-LD）工具函数
 * 用于生成符合 Schema.org 规范的结构化数据，提升 SEO
 */

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': string;
    telephone?: string;
    contactType: string;
    email?: string;
  };
}

export interface WebSiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': string;
    target: {
      '@type': string;
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface WebPageSchema {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  url: string;
  inLanguage?: string | string[];
  isPartOf?: {
    '@type': string;
    name: string;
    url: string;
  };
  breadcrumb?: {
    '@type': string;
    '@id': string;
  };
}

export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': string;
    name: string;
  };
  publisher?: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
}

/**
 * 生成组织信息结构化数据
 */
export function generateOrganizationSchema(
  name: string = 'PromptValar',
  url: string = 'https://promptvalar.com',
  logo: string = 'https://promptvalar.com/logo.svg',
  description?: string,
  socialLinks?: string[]
): OrganizationSchema {
  const schema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
  };

  if (description) {
    schema.description = description;
  }

  if (socialLinks && socialLinks.length > 0) {
    schema.sameAs = socialLinks;
  }

  return schema;
}

/**
 * 生成网站信息结构化数据（包含搜索功能）
 */
export function generateWebSiteSchema(
  name: string = 'PromptValar',
  url: string = 'https://promptvalar.com',
  description?: string,
  enableSearchAction: boolean = true
): WebSiteSchema {
  const schema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
  };

  if (description) {
    schema.description = description;
  }

  if (enableSearchAction) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/library?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

/**
 * 生成网页信息结构化数据
 */
export function generateWebPageSchema(
  name: string,
  url: string,
  description?: string,
  languages: string[] = ['en', 'zh-CN']
): WebPageSchema {
  const schema: WebPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
    inLanguage: languages.length === 1 ? languages[0] : languages,
    isPartOf: {
      '@type': 'WebSite',
      name: 'PromptValar',
      url: 'https://promptvalar.com',
    },
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

/**
 * 生成文章信息结构化数据
 */
export function generateArticleSchema(
  headline: string,
  url: string,
  description?: string,
  image?: string,
  datePublished?: string,
  dateModified?: string,
  authorName: string = 'PromptValar Team'
): ArticleSchema {
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    url,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PromptValar',
      logo: {
        '@type': 'ImageObject',
        url: 'https://promptvalar.com/logo.svg',
      },
    },
  };

  if (description) {
    schema.description = description;
  }

  if (image) {
    schema.image = image;
  }

  if (datePublished) {
    schema.datePublished = datePublished;
  }

  if (dateModified) {
    schema.dateModified = dateModified;
  }

  return schema;
}

/**
 * 生成软件应用结构化数据
 */
export function generateSoftwareApplicationSchema(
  name: string = 'PromptValar',
  url: string = 'https://promptvalar.com',
  description?: string,
  applicationCategory: string = 'WebApplication',
  operatingSystem: string = 'Web'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    url,
    applicationCategory,
    operatingSystem,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    ...(description && { description }),
  };
}

/**
 * 生成面包屑导航结构化数据
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

