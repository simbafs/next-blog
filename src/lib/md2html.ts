import matter from 'gray-matter'
//
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

export default async function md2html(content: string) {
	const matterResult = matter(content)

	const contentHTML = await unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeSanitize)
		.use(rehypeStringify)
		.process(matterResult.content)

	return {
		contentHTML: contentHTML.toString(),
		matter: matterResult.data,
	}
}
