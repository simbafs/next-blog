import Link from 'next/link'

export default function LinkList({ list }) {
	return (
		<ul>
			{list.map(i => (
				<li key={i}>
					<Link href={i}>
						<a>{i}</a>
					</Link>
				</li>
			))}
		</ul>
	)
}
