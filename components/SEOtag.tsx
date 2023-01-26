import Head from 'next/head';

interface SEOprops {
  title: string;
  description?: string;
  image?: string;
}

const SEOtag = ({ title, description, image }: SEOprops) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {/* <meta property="og:url" content= /> */}
      {/* <meta property="og:site_name" content="Proto" /> */}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* <meta name="twitter:site" content='' /> */}
      {/* <meta name="twitter:creator" content='' /> */}
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEOtag;
