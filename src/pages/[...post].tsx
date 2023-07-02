import { useRouter } from 'next/router'
import fs from 'fs/promises'
import { join } from 'path'

import { File } from '@/components/post'
import Terminal from '@/components/terminal'
import { tree, tree2list } from '@/lib/tree'
import TerminalLayout from '@/layouts/terminal'
import md2html from '@/lib/md2html'

export default function Content({ file, dirs }: {
	file?: File
	dirs?: string[]
}) {
	const router = useRouter()
	const cwd = router.asPath.slice(1) + '/'
	if (file) {
		return <TerminalLayout title={`open ${file.filename}`} description='file'>
			<Terminal initCmd={[`open ${file.filename}`]} stdin={[file.contentHTML]} />
		</TerminalLayout>
	}
	if (dirs) {
		return <TerminalLayout title={`open ${cwd}`} description='dir'>
			<Terminal initCmd={[`open ${cwd}`]} stdin={[dirs]} />
		</TerminalLayout>
	}
	return <TerminalLayout title="404" description='404'>
		<Terminal />
	</TerminalLayout>
}

export async function getStaticProps({ params }: {
	params: { post: string[] }
}) {
	const filename = join(...params.post)
	const postPath = join(process.cwd(), 'content', filename)
	if ((await fs.stat(postPath)).isFile()) {
		const content = (await fs.readFile(postPath)).toString()
		const { contentHTML, matter } = await md2html(content)

		return {
			props: {
				file: {
					filename,
					content,
					contentHTML,
					matter,
				} as File,
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
