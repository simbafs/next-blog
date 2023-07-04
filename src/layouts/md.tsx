import React from 'react'
import PS1 from '../components/terminal/PS1'
import Terminal from '../components/terminal/index'
import TerminalLayout from './terminal'

export default function MDLayout({ title, description, children }: React.PropsWithChildren<{
    title: string
    description: string
}>) {
    return <TerminalLayout title={title} description={description}>
        <PS1 />
        <div
            className="grow overflow-scroll p-1 pt-4 prose lg:prose-xl hover:prose-a:underline-offset-1 max-w-none"
        >
            {children}
        </div>
        <Terminal />
    </TerminalLayout>
}
