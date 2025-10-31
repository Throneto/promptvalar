import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  structuredData?: object;
}

export default function SEO({
  title = 'PromptValar - AI Prompt Engineering Made Easy',
  description = 'Create professional AI prompts for Sora, Veo, Midjourney and more. AI-powered optimization, structured editing, and a vast library of community prompts.',
  keywords = 'AI prompts, Sora prompts, Veo prompts, Midjourney prompts, AI video generation, prompt engineering, AI tools',
  image = 'https://promptvalar.com/og-image.jpg',
  url = 'https://promptvalar.com',
  type = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
  author = 'PromptValar Team',
  structuredData,
}: SEOProps) {
  const fullTitle = title === 'PromptValar - AI Prompt Engineering Made Easy' 
    ? title 
    : `${title} | PromptValar`;
  
  const fullUrl = url.startsWith('http') ? url : `https://promptvalar.com${url}`;
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return (
    <Helmet>
      {/* 基本元标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="language" content="English, Chinese" />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="PromptValar" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="zh_CN" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@PromptValar" />
      <meta name="twitter:creator" content="@PromptValar" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />
      
      {/* 多语言支持 - hreflang */}
      <link rel="alternate" hrefLang="en" href={fullUrl} />
      <link rel="alternate" hrefLang="zh-CN" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />
      
      {/* 结构化数据 JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

