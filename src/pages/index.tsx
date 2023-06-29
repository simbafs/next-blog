import Head from 'next/head'

import LinkList from '@/components/linkList'
import { tree, tree2list } from '@/lib/tree'

export default function Home({ posts }: {
	posts: string[]
}) {
	return (
		<>
			<Head>
				<title>Home</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1>Home</h1>
			<LinkList list={posts} />
		</>
	)
}

export async function getStaticProps() {
	const posts = tree2list(
		await tree('content', { extensions: ['.md'] }),
		{
			sliceHead: 1,
			expandDir: false,
		}
	)
	return { props: { posts } }
}
