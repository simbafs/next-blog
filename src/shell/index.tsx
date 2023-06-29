// TODO: auto load every js file in this directory
// maybe this https://stackoverflow.com/questions/75126196/dynamically-import-all-images-from-a-folder-in-astro
// or this https://stackoverflow.com/questions/44987464/import-all-modules-from-a-directory-at-once-node
// or this https://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder

import { useRouter } from "next/router"
import Link from "next/link"
import React, { useEffect } from "react"

type Terminal = {
	history: string[][]
	updateHistory: React.Dispatch<{
		clear?: boolean
		next?: string[][]
	}>
	files?: any[]
}

type Props = {
	args: string[]
	terminal: Terminal
	data?: any
}

// helpers

function ClickCmd({ cmd, terminal }: { cmd: string[], terminal: Terminal }) {
	return <a
		className="underline hover:underline-offset-1"
		href="javascript:void(0)"
		onClick={() => terminal.updateHistory({ next: [cmd] })}
	> {cmd.join(' ')}</a>
}

function insertBetween(arr: any, between: any): any[] {
	return arr.reduce((acc: any, curr: any) => [...acc, between, curr], []).slice(1)
}

export default function Shell({ args, terminal, data }: Props) {
	const cmd = cmds[args[0]]
	if (!cmd) {
		return cmds['commandNotFound']({
			args: ['commandNotFound', ...args],
			terminal,
		})
	}
	return cmd({ args, terminal, data })
}

const cmds: { [cmd: string]: (prop: Props) => React.JSX.Element } = {
	clear: Clear,
	banner: Banner,
	help: Help,
	echo: Echo,
	ls: Ls,
	cd: Cd,
	reboot: Reboot,
	commandNotFound: CommandNotFound,
}

export const cmdList = Object.keys(cmds)

// cmds

function Reboot() {
	const router = useRouter()
	router.reload()
	return <></>
}

function Cd({ args }: Props) {
	const router = useRouter()
	useEffect(() => {
		if (args.length === 1) {
			router.push('/')
		} else if (args[1][0] === '/') {
			router.push(args[1])
		} else {
			router.push(router.asPath + '/' + (args[1] || '/'))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return <></>
}

// ls('.', data)
function Ls({ /*args,*/ terminal }: Props) {
	// TODO base
	const files = terminal?.files || []
	const formatedDate = (date: Date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
	return <ul>
		{files.map((file, index) => <li key={index}>• <span>{formatedDate(file.data.pubDate)}</span> <a className="underline hover:underline-offset-1" href={`/newBlog/post/${file.slug}`}>{file.data.title}</a></li>)}
	</ul>
}

function CommandNotFound({ args }: Props) {
	return <p>command not found: {args[1]}</p>
}

function Echo({ args, data }: Props) {
	return <>
		<p>{args.slice(1).join(' ')}</p>
		{data && <pre className="overflow-scroll">{JSON.stringify(data, null, 2)}</pre>}
	</>
}

function Clear({ terminal }: Props) {
	terminal.updateHistory({ clear: true })
	return <></>
}

function Help({ terminal }: Props) {
	return <p>Available commands: {insertBetween(cmdList.map((cmd, index) => <ClickCmd key={index} cmd={[cmd]} terminal={terminal} />), ', ')}</p >
}

function Banner({ terminal }: Props) {
	return <>
		<div className="overflow-scroll break-keep">
			<p>╱╭━━━╮╱╱╭━━╮╱╱╭━╮╭━╮╱╱╭━━╮╱╱╱╭━━━╮╱╱╭━━━╮╱╱╭━━━╮╱╱╱╱╱╱╭━━━╮╱╱╭━━━╮╱</p>
			<p>╱┃╭━╮┃╱╱╰┫┣╯╱╱┃┃╰╯┃┃╱╱┃╭╮┃╱╱╱┃╭━╮┃╱╱┃╭━━╯╱╱┃╭━╮┃╱╱╱╱╱╱┃╭━╮┃╱╱┃╭━╮┃╱</p>
			<p>╱┃╰━━╮╱╱╱┃┃╱╱╱┃╭╮╭╮┃╱╱┃╰╯╰╮╱╱┃┃╱┃┃╱╱┃╰━━╮╱╱┃╰━━╮╱╱╱╱╱╱┃┃╱╰╯╱╱┃┃╱╰╯╱</p>
			<p>╱╰━━╮┃╱╱╱┃┃╱╱╱┃┃┃┃┃┃╱╱┃╭━╮┃╱╱┃╰━╯┃╱╱┃╭━━╯╱╱╰━━╮┃╱╱╱╱╱╱┃┃╱╭╮╱╱┃┃╱╭╮╱</p>
			<p>╱┃╰━╯┃╱╱╭┫┣╮╱╱┃┃┃┃┃┃╱╱┃╰━╯┃╱╱┃╭━╮┃╱╱┃┃╱╱╱╱╱┃╰━╯┃╱╱╭╮╱╱┃╰━╯┃╱╱┃╰━╯┃╱</p>
			<p>╱╰━━━╯╱╱╰━━╯╱╱╰╯╰╯╰╯╱╱╰━━━╯╱╱╰╯╱╰╯╱╱╰╯╱╱╱╱╱╰━━━╯╱╱╰╯╱╱╰━━━╯╱╱╰━━━╯╱</p>
		</div>
		<p># Social</p>
		<p>• <Link href="https://github.com/simbafs" target="_blank" className="underline hover:underline-offset-1">GitHub</Link></p>
		<p>• <Link href="https://twitter.com/simbafs" target="_blank" className="underline hover:underline-offset-1">Twitter</Link></p>
		<br />
		<p>use <ClickCmd cmd={['help']} terminal={terminal} /> to list all commands</p>
		<p>use <ClickCmd cmd={['cd', 'post']} terminal={terminal} /> to read blog posts</p>
	</>
}
