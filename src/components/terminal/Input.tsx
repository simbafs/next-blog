import React, { useState } from 'react'
import { HistoryObj, cmdList } from '@/shell/index'

export default function Input({
	cmdIndex,
	historyObj,
}: {
	cmdIndex?: number
	historyObj: HistoryObj
}) {
	const [value, setValue] = useState('')


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
	}

	const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return
		historyObj.update({
			next: [value],
		})
		setValue('')
	}

	if (cmdIndex !== undefined) {
		return <div className="flex">
			<span className="text-cyan whitespace-nowrap">$&nbsp;</span>
			<span className="">{historyObj.history[cmdIndex]}</span>
		</div>
	}

	return (
		<div className="flex">
			<span className="text-cyan whitespace-nowrap">$&nbsp;</span>
			<input
				type="text"
				className={`bg-base03 border-none outline-none flex-grow ${cmdList.includes(value.split(' ')[0]) || value.length === 0 ? 'text-green' : 'text-red'}`}
				autoFocus={true}
				autoComplete="off"
				spellCheck="false"
				tabIndex={0}
				value={value}
				onChange={handleChange}
				onKeyDown={handleEnter}
			/>
		</div>
	)
}
