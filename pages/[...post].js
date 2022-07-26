import { useRouter } from "next/router"

import FillTree from 'directory-tree'
import tree2list from "../util/tree2list"

export default function (){
	const router = useRouter()
	const { post } = router.query
	return(
		<div>
			<h1>{post}</h1>
		</div>
	)
}

export function getStaticPaths(){
	const tree = FileTree('./content', { extensions: /\.md$/ })
	const paths = tree2list(tree, { sliceHead: 1 })
	return {
		paths,
		fallback: false,
	}
}
