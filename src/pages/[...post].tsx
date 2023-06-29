import { useRouter } from 'next/router'
import fs from 'fs/promises'
import { join } from 'path'

import Post from '@/components/post'
import LinkArray from '@/components/LinkArray'
import PS1 from '@/components/terminal/PS1'
import Terminal from '@/components/terminal'
import { tree, tree2list } from '@/lib/tree'
import TerminalLayout from '@/layouts/terminal'

export default function Content({ file, dirs }: {
	file?: {
		title: string,
		content: string
	},
	dirs?: string[],
}) {
	const router = useRouter()
	const cwd = router.asPath.slice(1) + '/'
	return (
		<TerminalLayout title={file?.title || 'dir'} description='file'>
			<PS1 cmd={['open', router.asPath]} />
			{file && <Post title={file.title} content={file.content} />}
			{dirs && <LinkArray list={dirs.map(dir => ({
				href: dir,
				text: dir.replace(cwd, ''),
			}))} />}
			<Terminal />
		</TerminalLayout>
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
