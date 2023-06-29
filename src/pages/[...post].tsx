import Head from 'next/head'
import fs from 'fs/promises'
import { join } from 'path'

import Post from '@/components/post'
import LinkList from '@/components/linkList'
import { tree, tree2list } from '@/lib/tree'

export default function Content({ file, dirs }: {
	file?: {
		title: string,
		content: string
	},
	dirs?: string[],
}) {
	return (
		<>
			<Head>
				<title>{file?.title || 'dir'}</title>
			</Head>
			{file ? (
				<Post title={file.title} content={file.content} />
			) : (
				<LinkList list={dirs || []} />
			)}
		</>
	)
}

export async function getStaticProps({ params }: {
	params: { post: string[] }
}) {
	const fileName = join(...params.post)
	const postPath = join(process.cwd(), 'content', fileName)
	if ((await fs.stat(postPath)).isFile()) {
		const files = (await fs.readFile(postPath)).toString()
		return {
			props: {
				file: {
					title: fileName,
					content: files,
				},
			},
		}
	} else {
		const dirs = tree2list(
			await tree(postPath, { extensions: ['.md'] }),
			{ sliceHead: 7 }
		)

		return {
			props: { dirs: dirs },
		}
	}
}

export async function getStaticPaths() {
	const paths = tree2list(await tree(`content`, { extensions: ['.md'] }), {
		sliceHead: 1,
		expandDir: true,
		includeDir: true,
	}).map(i => ({
		params: { post: i.split('/') },
	}))

	return {
		paths: paths,
		fallback: false,
	}
}
