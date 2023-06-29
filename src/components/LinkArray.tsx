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
						<Link href={item}>{item}</Link>
					</li>
					: <li key={item.href}>
						<Link href={item.href}>{item.text}</Link>
					</li>
			))}
		</ul>
	)
}
