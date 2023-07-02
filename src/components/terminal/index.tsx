import { useReducer } from 'react'
import Cell from './Cell'

export type History = string[]
export type HistoryAction = {
	clear?: boolean
	next?: string[]
}

export default function Terminal({ initCmd, stdin }: {
	initCmd?: History
	stdin?: any[]
}) {
	const [history, updateHistory] = useReducer(
		(prev: History, action: HistoryAction) => {
			if (action.clear) return []
			return [...prev, ...action?.next || []]
		},
		initCmd || []
	)

	return <>
		{history.map((_, index) => <Cell
			key={index}
			cmdIndex={index}
			historyObj={{
				history,
				update: updateHistory,
			}}
			stdin={stdin?.[index]}
		/>)}
		<Cell
			historyObj={{
				history,
				update: updateHistory,
			}}
		/>
	</>

}
