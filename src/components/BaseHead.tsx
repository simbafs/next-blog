import Head from "next/head"

export interface Props {
	title: string
	description: string
	// image?: string
}

export default function BaseHead({ title, description }: Props) {
	// export default function BaseHead({ title, description/*, image = '/placeholder-social.jpg'*/ }: Props) {
	// TODO
	// const canonicalURL = new URL(Astro.url.pathname, Astro.site)
	return <Head>
		{/* Global Metadata */}
		<meta charSet="utf-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

		{/* Canonical URL */}
		{/* <link rel="canonical" href={canonicalURL} /> */}

		{/* Primary Meta Tags */}
		<title>{title}</title>
		<meta name="title" content={title} />
		<meta name="description" content={description} />

		{/* Open Graph / Facebook */}
		<meta property="og:type" content="website" />
		{/* <meta property="og:url" content={Astro.url} /> */}
		<meta property="og:title" content={title} />
		<meta property="og:description" content={description} />
		{/* <meta property="og:image" content={new URL(image, Astro.url)} /> */}

		{/* Twitter */}
		<meta property="twitter:card" content="summary_large_image" />
		{/* <meta property="twitter:url" content={Astro.url} /> */}
		<meta property="twitter:title" content={title} />
		<meta property="twitter:description" content={description} />
		{/* <meta property="twitter:image" content={new URL(image, Astro.url)} /> */}
	</Head>
}
