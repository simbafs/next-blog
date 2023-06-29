import React from 'react'
import Head from 'next/head'
import BaseHead from '../components/BaseHead'
import NavLink from '../components/NavLink'

export default function TerminalLayout({ title, description, children }: React.PropsWithChildren<{
    title: string
    description: string
}>) {
    return <>
        <Head>
            <BaseHead title={title} description={description} />
        </Head>
        <div className="m-0 h-screen w-screen bg-base03 p-4 leading-5 text-base3">
            <div className="flex h-full w-full flex-col rounded-lg border-2 border-solid border-base2">
                <div className="flex flex-wrap border-b-2 px-2 py-3">
                    <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 shrink-0 rounded-full bg-red"></div>
                        <div className="h-4 w-4 shrink-0 rounded-full bg-yellow"></div>
                        <div className="h-4 w-4 shrink-0 rounded-full bg-green"></div>
                    </div>
                    <div className="grow">
                        <p className="break-all text-center font-bold">
                            &gt; ssh blog.simbafs.cc &lt;
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center space-x-2">
                        {/* TODO this shoud be done in NavLink  */}
                        <NavLink href="/">[H]ome</NavLink>
                        <NavLink href="/archive">[A]rchive</NavLink>
                        <NavLink href="/search">[S]earch</NavLink>
                        <NavLink href="/about">a[B]out</NavLink>
                        <NavLink href="/tag">[T]ag</NavLink>
                    </div>
                </div>
                <div className="grow overflow-scroll p-1">
                    {children}
                </div>
            </div>
        </div>
    </>
}
