import Link from 'next/link'

export default function LinkList({ list }: {
	list: string[]
}) {
	return (
		<ul>
			{list.map(i => (
				<li key={i}>
					<Link href={i}>{i}</Link>
				</li>
			))}
		</ul>
	)
}
