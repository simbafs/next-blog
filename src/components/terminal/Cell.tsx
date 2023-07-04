import PS1 from './PS1'
import Input from './Input'
import Shell, { FS } from '@/shell'
import { HistoryObj } from '@/shell'

export default function Cell({ cmdIndex, historyObj, stdin, fs }: {
    cmdIndex?: number
    historyObj: HistoryObj
    stdin?: any
    fs?: FS
}) {
    if (cmdIndex !== undefined) {
        // input is a static string
        return (
            <div className='break-keep'>
                <PS1 />
                <Input
                    cmdIndex={cmdIndex}
                    historyObj={historyObj}
                />
                <Shell
                    cmdIndex={cmdIndex}
                    historyObj={historyObj}
                    stdin={stdin}
                    fs={fs}
                />
            </div>
        )
    }

    // input in a input box
    return <div className="break-keep">
        <PS1 />
        <Input historyObj={historyObj} />
    </div>
}
