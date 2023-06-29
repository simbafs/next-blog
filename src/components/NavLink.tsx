import React, { AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function NavLink({ href, children, /*...props*/ }: React.PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) {
    const router = useRouter()
    const isActive = href === router.pathname || href === router.pathname.replace(/\/$/, '')
    return <>
        <Link
            href={href as string}
            className={[
                'underline',
                'hover:underline-offset-1',
                isActive && 'bg-base3',
                isActive && 'text-base03'
            ].join(' ')}
        >
            {children}
        </Link>
    </>
}
