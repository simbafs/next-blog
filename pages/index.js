import Head from 'next/head';
import Link from 'next/link';
import path from 'path';
import FileTree from 'directory-tree'

import tree2list from '../util/tree2list';

export async function getStaticProps() {
	const tree = FileTree('./content', { extensions: /\.md$/ })
	return {
		props: {
			posts: tree2list(tree, { sliceHead: 1 })
		},
	};
}

/** @typedef {Object} PostProps
 *  @property {string} post
 */ 
/** @param {PostProps} props */
function Post({ post }){
	return(
		<div>
			<Link href={post}><a>{path.basename(post)}</a></Link>
		</div>
	)
}

export default function Home({ posts }) {
	return (
		<>
			<Head>
				<title>Home</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1>Home</h1>
			{posts.map(post => <Post key={post} post={post} />)}
		</>
	)
}
