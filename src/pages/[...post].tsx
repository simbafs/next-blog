import { File } from '@/components/post'
import Terminal from '@/components/terminal'
import TerminalLayout from '@/layouts/terminal'
import md2html from '@/lib/md2html'
import { tree, tree2list } from '@/lib/tree'
import { FS } from '@/shell'
import fs from 'fs/promises'
import { useRouter } from 'next/router'
import { join } from 'path'

export default function Content({ fs }: {
	fs: FS
}) {
	const router = useRouter()
	const cwd = router.asPath.slice(1) + '/'
	if (fs.file) {
		return <TerminalLayout title={`open ${fs.file.filename}`} description='file'>
			<Terminal initCmd={[`open ${fs.file.filename}`]} fs={fs} />
		</TerminalLayout>
	}
	return <TerminalLayout title={`ls ${cwd}`} description='dir'>
		<Terminal initCmd={[`ls ${cwd}`]} fs={fs} />
	</TerminalLayout>
}

export async function getStaticProps({ params }: {
	params: { post: string[] }
}): Promise<{ props: { fs: FS } }> {
	const directory = await tree('content', { extensions: ['.md'] })
	const filename = join(...params.post)
	const postPath = join(process.cwd(), 'content', filename)

	if ((await fs.stat(postPath)).isFile()) {
		const content = (await fs.readFile(postPath)).toString()
		const { contentHTML, matter } = await md2html(content)

		return {
			props: {
				fs: {
					directory,
					file: {
						filename,
						content,
						contentHTML,
						matter,
					} as File,
				}
			},
		}
	} else {
		return {
			props: {
				fs: {
					directory,
				}
			},
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
