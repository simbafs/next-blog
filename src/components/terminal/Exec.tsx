import Shell, { Terminal } from '@/shell'

export default function Exec({ args, terminal }: {
	args: string[]
	terminal: Terminal
}) {
	return <Shell
		args={args}
		terminal={terminal}
	/>
}
