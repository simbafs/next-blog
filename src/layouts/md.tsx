import React from 'react'
import TerminalLayout from './terminal'
import Terminal from '../components/terminal/index'

import PS1 from '../components/terminal/PS1'
import { useRouter } from 'next/router'

export default function MDLayout({ title, description, children }: React.PropsWithChildren<{
    title: string
    description: string
}>) {
    const router = useRouter()

    return <TerminalLayout title={title} description={description}>
        <PS1 cmd={['open', router.asPath]} />
        <div
            className="grow overflow-scroll p-1 pt-4 prose lg:prose-xl hover:prose-a:underline-offset-1 max-w-none"
        >
            {children}
        </div>
        <Terminal />
    </TerminalLayout>
}
