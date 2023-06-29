import Shell from '../../shell'
// import { CollectionEntry } from 'astro:content'

export default function Exec({ args, terminal, data }: {
	args: string[]
	terminal: {
		history: string[][]
		updateHistory: React.Dispatch<{
			clear?: boolean
			next?: string[][]
		}>
		// files?: CollectionEntry<'blog'>[]
		files: any[]
	}
	data?: any
}) {
	return <Shell
		args={args}
		terminal={terminal}
		data={data}
	/>
}
