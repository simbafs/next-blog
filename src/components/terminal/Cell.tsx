import PS1 from './PS1'
import Input from './Input'
import Shell from '@/shell'
import { HistoryObj } from '@/shell'

export default function Cell({ cmdIndex, historyObj, stdin }: {
    cmdIndex?: number
    historyObj: HistoryObj
    stdin?: any
}) {
    if (cmdIndex !== undefined) {
        // input is a static string
        return (
            <div className='break-keep'>
                <PS1 />
                <Input cmdIndex={cmdIndex} historyObj={historyObj} />
                <Shell cmdIndex={cmdIndex} historyObj={historyObj} stdin={stdin} />
            </div>
        )
    }

    // input in a input box
    return <div className="break-keep">
        <PS1 />
        <Input historyObj={historyObj} />
    </div>
}
