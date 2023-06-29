import { useReducer } from 'react'
import PS1 from './PS1'
import Exec from './Exec'

export default function Terminal({ initCmd, files }: {
	initCmd?: string[][]
	// files?: CollectionEntry<'blog'>[]
	files?: any[]
}) {
	const [history, updateHistory] = useReducer(
		(prev: string[][], action: {
			clear?: boolean,
			next?: string[][],
		}) => {
			if (action.clear) return []
			return [...prev, ...action?.next || []]
		},
		initCmd || [],
	)

	return <>
		{history.map((cmd, index) => (
			<div key={index} style={{
				wordBreak: 'break-all',
			}}>
				<PS1 cmd={cmd} />
				<Exec args={cmd} terminal={{
					history,
					updateHistory,
					files: files || [],
				}} />
			</div>
		))}
		<PS1 updateHistory={updateHistory} />
	</>

}
