import Link from 'next/link'

export default function LinkArray({ list }: {
	list: ({
		href: string
		text: string
	} | string)[]
}) {
	return (
		<ul>
			{list.map(item => (
				typeof item === 'string'
					? <li key={item}>
						<Link className="underline hover:underline-offset-1" href={item}>{item}</Link>
					</li>
					: <li key={item.href}>
						<Link className="underline hover:underline-offset-1" href={item.href}>{item.text}</Link>
					</li>
			))}
		</ul>
	)
}
