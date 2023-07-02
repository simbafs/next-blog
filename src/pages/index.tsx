import fs from 'fs/promises'
import Terminal from '@/components/terminal'
import TerminalLayout from '@/layouts/terminal'
import md2html from '@/lib/md2html'
import path from 'path'

export default function Home({ indexHTML }: {
	indexHTML: string
}) {
	return (
		<TerminalLayout title="Home" description="Home">
			<Terminal initCmd={['banner', 'open index.md']} stdin={[, indexHTML]} />
		</TerminalLayout>
	)
}

export async function getStaticProps() {
	const indexFilename = await fs.readdir(path.join('content')).then(files => files.find(file => file.includes('index')))

	if (!indexFilename) return { props: {} }

	const indexFile = await fs.readFile(path.join('content', indexFilename), 'utf-8')
	if (indexFilename.endsWith('.md')) return {
		props: {
			indexHTML: (await md2html(indexFile)).contentHTML,
		},
	}

	return {
		props: {
			indexHTML: indexFile,
		},
	}
}
