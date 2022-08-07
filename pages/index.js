import Head from "next/head";
import path from "path";

import LinkList from "../components/linkList";
import { tree, tree2list } from "../util/tree";

export default function Home({ posts }) {
	return (
		<>
			<Head>
				<title>Home</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1>Home</h1>
			<LinkList list={posts} />
		</>
	);
}

export async function getStaticProps() {
	const posts = tree2list(
		await tree("content", {
			extensions: [".md"],
			includeDir: true,
		}),
		{
			sliceHead: 1,
		}
	);
	return { props: { posts } };
}
