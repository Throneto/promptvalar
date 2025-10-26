import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export default function SEO({
  title = 'PromptValar - AI Prompt Engineering Made Easy',
  description = 'Create professional AI prompts for Sora, Veo, Midjourney and more. AI-powered optimization, structured editing, and a vast library of community prompts.',
  keywords = 'AI prompts, Sora prompts, Veo prompts, Midjourney prompts, AI video generation, prompt engineering, AI tools',
  image = 'https://promptvalar.com/og-image.jpg',
  url = 'https://promptvalar.com',
  type = 'website',
}: SEOProps) {
  const fullTitle = title === 'PromptValar - AI Prompt Engineering Made Easy' 
    ? title 
    : `${title} | PromptValar`;

  return (
    <Helmet>
      {/* 基本元标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* 额外的 SEO 标签 */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="PromptValar Team" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}

