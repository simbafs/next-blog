export default function Post({ title, content }: {
	title: string
	content: string
}) {
	return (
		<div>
			<h1>{title}</h1>
			<article>{content}</article>
		</div>
	)
}
