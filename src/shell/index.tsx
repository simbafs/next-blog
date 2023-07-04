// TODO: auto load every js file in this directory
// maybe this https://stackoverflow.com/questions/75126196/dynamically-import-all-images-from-a-folder-in-astro
// or this https://stackoverflow.com/questions/44987464/import-all-modules-from-a-directory-at-once-node
// or this https://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder

import { useRouter } from "next/router"
import Link from "next/link"
import React from "react"

import { History, HistoryAction } from '@/components/terminal'
import parseCmd, { Cmd } from "./parseCmd"
import { Node } from '@/lib/tree'
import Post, { File } from "@/components/post"
import { join } from 'path'

export type HistoryObj = {
	history: History
	update: React.Dispatch<HistoryAction>
}

export type FS = {
	directory: Node
	file?: File
}

type Props = {
	args: string[]
	historyObj: HistoryObj
	stdin?: any
	fs?: FS
}

export default function Shell({ cmdIndex, historyObj, stdin, fs }: {
	cmdIndex: number
	historyObj: HistoryObj
	stdin?: any
	fs?: FS
}) {
	const cmdStr = historyObj.history[cmdIndex]

	// return <pre>{JSON.stringify(cmdStr, null, 2)}</pre>
	// tokenize/parse 
	let cmd: Cmd | undefined = parseCmd(cmdStr)

	// execute each part of command, and pass stdin, stdout
	let stdout: string | React.JSX.Element | undefined
	do {
		const cmdFn = cmds[cmd.current[0]]
		if (cmdFn) {
			stdout = cmdFn({ args: cmd.current, historyObj, stdin, fs })
		} else {
			stdout = CommandNotFound({ args: cmd.current, historyObj, stdin, fs })
		}
		if (cmd.conjunction === '|') {
			stdin = stdout
		}
		cmd = cmd.next
	} while (cmd)

	// print the stdout to the terminal
	if (!stdout) {
		return <></>
	} else if (typeof stdout === 'string') {
		return <pre>{stdout}</pre>
	} else {
		return stdout
	}
}

// helpers

function ClickCmd({ cmd, terminal }: { cmd: string, terminal: HistoryObj }) {
	return <a
		className="underline hover:underline-offset-1"
		href="#"
		onClick={() => terminal.update({ next: [cmd] })}
	> {cmd}</a>
}

const cmds: { [cmd: string]: (prop: Props) => React.JSX.Element | string | undefined } = {
	clear: Clear,
	banner: Banner,
	help: Help,
	echo: Echo,
	ls: Ls,
	cd: Cd,
	reboot: Reboot,
	open: Open,
	commandNotFound: CommandNotFound,
	banner404: Banner404,
}

export const cmdList = Object.keys(cmds)

// cmds

function Open({ fs }: Props) {
	if (!fs?.file) return <></>
	return <Post file={fs.file} />
}

function Reboot() {
	const router = useRouter()
	router.reload()
	return <></>
}

function Cd({ args, historyObj: history }: Props) {
	const router = useRouter()
	history.update({ clear: true })
	if (!args[1]) {
		router.push('/')
	} else if (args[1][0] === '/') {
		router.push(args[1])
	} else {
		router.push(router.asPath + '/' + (args[1] || '/'))
	}
	return <></>
}

// ls('.', data)
function Ls({ args, fs }: Props) {
	const router = useRouter()

	if (!fs) return <></>

	const destinationPath = join(fs.directory.path, args[1] || router.asPath.slice(1)).replace(/\/$/, '')

	let current: Node | undefined = fs.directory

	while (current && current.path !== destinationPath) {
		current = current.children?.find(child => destinationPath.includes(child.path))
	}

	// const formatedDate = (date: Date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

	return <ul>
		{current?.children?.map((child, index) => <li key={index}>
			<a
				// TODO 
				href={child.path.replace('content', '')}
				className="underline hover:underline-offset-1"
			>{child.name}</a>
		</li>)}
	</ul>
}

function CommandNotFound({ args }: Props) {
	return <p>command not found: {args[1]}</p>
}

function Echo({ args/*, termianl*/ }: Props) {
	return <>
		<p>{args.slice(1).join(' ')}</p>
		{/* {data && <pre className="overflow-scroll">{JSON.stringify(data, null, 2)}</pre>} */}
	</>
}

function Clear({ historyObj: history }: Props) {
	history.update({ clear: true })
	return <></>
}

function Help({ historyObj: terminal }: Props) {
	return <>
		<p>Available commands: </p>
		<ul>
			{cmdList.map((cmd, index) => <li key={index}>• <ClickCmd cmd={cmd} terminal={terminal} /></li>)}
		</ul>
	</>
}

function Banner404() {
	return <>
		<div className="overflow-scroll break-keep">
			<pre>██╗  ██╗  ██████╗  ██╗  ██╗</pre>
			<pre>██║  ██║ ██╔═████╗ ██║  ██║</pre>
			<pre>███████║ ██║██╔██║ ███████║</pre>
			<pre>╚════██║ ████╔╝██║ ╚════██║</pre>
			<pre>     ██║ ╚██████╔╝      ██║</pre>
			<pre>     ╚═╝  ╚═════╝       ╚═╝</pre>
			<pre>██████╗   █████╗   ██████╗  ███████╗     ███╗   ██╗  ██████╗  ████████╗</pre>
			<pre>██╔══██╗ ██╔══██╗ ██╔════╝  ██╔════╝     ████╗  ██║ ██╔═══██╗ ╚══██╔══╝</pre>
			<pre>██████╔╝ ███████║ ██║  ███╗ █████╗       ██╔██╗ ██║ ██║   ██║    ██║   </pre>
			<pre>██╔═══╝  ██╔══██║ ██║   ██║ ██╔══╝       ██║╚██╗██║ ██║   ██║    ██║   </pre>
			<pre>██║      ██║  ██║ ╚██████╔╝ ███████╗     ██║ ╚████║ ╚██████╔╝    ██║   </pre>
			<pre>╚═╝      ╚═╝  ╚═╝  ╚═════╝  ╚══════╝     ╚═╝  ╚═══╝  ╚═════╝     ╚═╝   </pre>
			<pre>███████╗  ██████╗  ██╗   ██╗ ███╗   ██╗ ██████╗ </pre>
			<pre>██╔════╝ ██╔═══██╗ ██║   ██║ ████╗  ██║ ██╔══██╗</pre>
			<pre>█████╗   ██║   ██║ ██║   ██║ ██╔██╗ ██║ ██║  ██║</pre>
			<pre>██╔══╝   ██║   ██║ ██║   ██║ ██║╚██╗██║ ██║  ██║</pre>
			<pre>██║      ╚██████╔╝ ╚██████╔╝ ██║ ╚████║ ██████╔╝</pre>
			<pre>╚═╝       ╚═════╝   ╚═════╝  ╚═╝  ╚═══╝ ╚═════╝ </pre>
		</div>
	</>
}

function Banner({ historyObj: terminal }: Props) {
	return <>
		<div className="overflow-scroll break-keep">
			<pre>╱╭━━━╮╱╱╭━━╮╱╱╭━╮╭━╮╱╱╭━━╮╱╱╱╭━━━╮╱╱╭━━━╮╱╱╭━━━╮╱╱╱╱╱╱╭━━━╮╱╱╭━━━╮╱</pre>
			<pre>╱┃╭━╮┃╱╱╰┫┣╯╱╱┃┃╰╯┃┃╱╱┃╭╮┃╱╱╱┃╭━╮┃╱╱┃╭━━╯╱╱┃╭━╮┃╱╱╱╱╱╱┃╭━╮┃╱╱┃╭━╮┃╱</pre>
			<pre>╱┃╰━━╮╱╱╱┃┃╱╱╱┃╭╮╭╮┃╱╱┃╰╯╰╮╱╱┃┃╱┃┃╱╱┃╰━━╮╱╱┃╰━━╮╱╱╱╱╱╱┃┃╱╰╯╱╱┃┃╱╰╯╱</pre>
			<pre>╱╰━━╮┃╱╱╱┃┃╱╱╱┃┃┃┃┃┃╱╱┃╭━╮┃╱╱┃╰━╯┃╱╱┃╭━━╯╱╱╰━━╮┃╱╱╱╱╱╱┃┃╱╭╮╱╱┃┃╱╭╮╱</pre>
			<pre>╱┃╰━╯┃╱╱╭┫┣╮╱╱┃┃┃┃┃┃╱╱┃╰━╯┃╱╱┃╭━╮┃╱╱┃┃╱╱╱╱╱┃╰━╯┃╱╱╭╮╱╱┃╰━╯┃╱╱┃╰━╯┃╱</pre>
			<pre>╱╰━━━╯╱╱╰━━╯╱╱╰╯╰╯╰╯╱╱╰━━━╯╱╱╰╯╱╰╯╱╱╰╯╱╱╱╱╱╰━━━╯╱╱╰╯╱╱╰━━━╯╱╱╰━━━╯╱</pre>
		</div>
		<p># Social</p>
		<p>• <Link href="https://github.com/simbafs" target="_blank" className="underline hover:underline-offset-1">GitHub</Link></p>
		<p>• <Link href="https://twitter.com/simbafs" target="_blank" className="underline hover:underline-offset-1">Twitter</Link></p>
		<br />
		<p>use <ClickCmd cmd={'help'} terminal={terminal} /> to list all commands</p>
		<p>use <ClickCmd cmd={'cd post'} terminal={terminal} /> to read blog posts</p>
	</>
}
