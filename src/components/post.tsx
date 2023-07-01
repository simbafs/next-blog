export type File = {
	filename: string,
	content: string,
	contentHTML: string,
	matter: {
		[key: string]: any
	}
}


export default function Post({ file }: {
	file: File
}) {
	return (
		<div
			className="prose lg:prose-xl hover:prose-a:underline-offset-1 max-w-none"
		>
			<div dangerouslySetInnerHTML={{ __html: file.contentHTML }} />
		</div>
	)
}
