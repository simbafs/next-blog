// TODO: auto load every js file in this directory
// maybe this https://stackoverflow.com/questions/75126196/dynamically-import-all-images-from-a-folder-in-astro
// or this https://stackoverflow.com/questions/44987464/import-all-modules-from-a-directory-at-once-node
// or this https://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder

import { useRouter } from "next/router"
import Link from "next/link"
import React from "react"
import LinkArray from "@/components/LinkArray"

import { History, HistoryAction } from '@/components/terminal'
import parseCmd, { Cmd } from "./parseCmd"

export type HistoryObj = {
	history: History
	update: React.Dispatch<HistoryAction>
}

type Props = {
	args: string[]
	history: HistoryObj
	stdin?: any
}

// insertBetween([1,2,3,4], 10) = [1, 10, 2, 10, 3, 10, 4, 10]
// function insertBetween(arr: any, between: any): any[] {
// 	return arr.reduce((acc: any, curr: any) => [...acc, between, curr], []).slice(1)
// }

export default function Shell({ cmdIndex, historyObj, stdin }: {
	cmdIndex: number
	historyObj: HistoryObj
	stdin?: any
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
			stdout = cmdFn({ args: cmd.current, history: historyObj, stdin })
		} else {
			stdout = CommandNotFound({ args: cmd.current, history: historyObj, stdin })
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
		return <div
			className="prose lg:prose-xl hover:prose-a:underline-offset-1 max-w-none"
			dangerouslySetInnerHTML={{ __html: stdout }}
		/>
	} else {
		return stdout
	}

	// if (!cmd) {
	// 	return cmds['commandNotFound']({
	// 		args: ['commandNotFound', ...args],
	// 		history: terminal,
	// 	})
	// }
	// return cmd({ args, history: terminal })
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

function Open({ stdin }: Props) {
	if (Array.isArray(stdin)) {
		return <LinkArray list={stdin} />
	}
	return <div
		className="prose lg:prose-xl hover:prose-a:underline-offset-1 max-w-none"
		dangerouslySetInnerHTML={{ __html: stdin }}
	/>
}

function Reboot() {
	const router = useRouter()
	router.reload()
	return <></>
}

function Cd({ args, history }: Props) {
	const router = useRouter()
	history.update({ clear: true })
	if (!args[1]) {
		// console.log('1. cd /')
		router.push('/')
	} else if (args[1][0] === '/') {
		// console.log('2. cd ' + args[1])
		router.push(args[1])
	} else {
		// console.log('3. cd ' + args[1])
		router.push(router.asPath + '/' + (args[1] || '/'))
	}
	return <></>
}

// ls('.', data)
function Ls({ /*args,*/ stdin }: Props) {
	// TODO base
	const formatedDate = (date: Date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
	if (Array.isArray(stdin)) {
		return <ul>
			{stdin.map((file, index) => <li key={index}>• <span>{formatedDate(file.data.pubDate)}</span> <a className="underline hover:underline-offset-1" href={`/newBlog/post/${file.slug}`}>{file.data.title}</a></li>)}
		</ul>
	}
	return <></>
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

function Clear({ history }: Props) {
	history.update({ clear: true })
	return <></>
}

function Help({ history: terminal }: Props) {
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

function Banner({ history: terminal }: Props) {
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
