export default function Post({ title, content }) {
	return (
		<div>
			<h1>{title}</h1>
			<pre>{content}</pre>
		</div>
	)
}
