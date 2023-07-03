export type Cmd = {
    current: string[]
    next?: Cmd
    conjunction?: typeof conjection[number]
}

const conjection = ['|'] as const

export default function parseCmd(cmd: string): Cmd {
    const splitted = cmd.split(' ')
    const conjunctionIndex = splitted.findIndex((s) => conjection.includes(s as any))

    if (conjunctionIndex === -1) {
        return {
            current: splitted,
        }
    }

    return {
        current: splitted.slice(0, conjunctionIndex),
        conjunction: splitted[conjunctionIndex] as typeof conjection[number],
        next: parseCmd(splitted.slice(conjunctionIndex + 1).join(' ')),
    }
}
