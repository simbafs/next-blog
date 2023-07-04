import imgLinks from '@pondorasti/remark-img-links'
import matter from 'gray-matter'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export default async function md2html(content: string, opt: {
	absolutePath: string
}) {
	console.log(opt)
	const matterResult = matter(content)

	const contentHTML = await unified()
		.use(remarkParse)
		.use(imgLinks, {
			absolutePath: opt.absolutePath,
		})
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeSanitize)
		.use(rehypeStringify)
		.process(matterResult.content)

	return {
		contentHTML: contentHTML.toString(),
		matter: matterResult.data,
	}
}
