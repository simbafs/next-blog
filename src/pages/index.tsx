import Terminal from '@/components/terminal'
import TerminalLayout from '@/layouts/terminal'
import md2html from '@/lib/md2html'
import { tree } from '@/lib/tree'
import { FS } from '@/shell'
import fs from 'fs/promises'
import path from 'path'

export default function Home({ fs }: {
	fs: FS
}) {
	return (
		<TerminalLayout title="Home" description="Home">
			<Terminal initCmd={['banner', 'open index.md']} fs={fs} />
		</TerminalLayout>
	)
}

export async function getStaticProps(): Promise<{ props: { fs?: FS } }> {
	const directory = await tree('content', { extensions: ['.md'] })
	const indexFilename = await fs.readdir(path.join('content')).then(files => files.find(file => file.includes('index')))

	if (!indexFilename) return { props: {} }

	const indexFile = await fs.readFile(path.join('content', indexFilename), 'utf-8')
	if (indexFilename.endsWith('.md')) {
		const { contentHTML, matter } = await md2html(indexFile, {
			absolutePath: `http://localhost:3000/`,
		})
		return {
			props: {
				fs: {
					directory,
					file: {
						filename: indexFilename,
						content: indexFile,
						contentHTML,
						matter,
					}
				} satisfies FS,
			},
		}
	}

	return {
		props: {
			fs: {
				directory,
				file: {
					filename: indexFilename,
					content: indexFile,
					contentHTML: indexFile,
					matter: {},
				}
			} satisfies FS,
		},
	}
}
