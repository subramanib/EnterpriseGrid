import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  structuredData?: Record<string, any>;
}

export function SEO({
  title = 'EnterpriseGrid - The AI-Powered Data Table',
  description = 'EnterpriseGrid - The ultimate AI-Powered Interactive Data Grid for modern React applications. Features AI insights, smart summaries, query assistant, and more.',
  keywords = 'React, Data Grid, Data Table, AI, Machine Learning, Enterprise, UI, React Components',
  url = 'https://enterprisegrid.io/',
  structuredData
}: SEOProps) {
  const siteTitle = title === 'EnterpriseGrid - The AI-Powered Data Table' ? title : `${title} | EnterpriseGrid`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:card" content="summary_large_image" />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
