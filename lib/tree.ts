import fs from 'fs/promises'
import { join, sep } from 'path'

type Node = {
	name: string
	path: string
	type: 'file' | 'directory' | 'null'
	children?: Node[]
}

type OptTree = {
	extensions: string[]
}
async function tree(root: string, opt: OptTree) {
	root = join(root)
	const item = await fs.readdir(root)
	const nodes: Node[] = (
		await Promise.all(
			item.map(async name => {
				const path = join(root, name)
				const stat = await fs.stat(path)
				if (stat.isDirectory()) {
					return await tree(path, opt)
				}
				if (
					opt.extensions &&
					!opt.extensions.some(i => name.endsWith(i))
				) {
					return {
						name: '',
						path: '',
						type: 'null',
					} as const
				}
				return {
					name,
					path,
					type: 'file',
				} as const
			})
		)
	).filter(i => i.type != 'null')
	return {
		name: root,
		path: root,
		type: 'directory',
		children: nodes,
	} as Node
}

type OptTree2List = {
	includeDir: boolean
	sliceHead: number
	sliceTail: number
}
function tree2list(tree: Node, opt: OptTree2List) {
	function slice(path: string) {
		const fragments = path.split(sep)
		return fragments
			.slice(
				opt?.sliceHead || 0,
				fragments.length - (opt?.sliceTail || 0)
			)
			.join(sep)
	}
	let list: string[] = []
	tree?.children?.forEach(node => {
		if (node.type === 'directory') {
			if (opt?.includeDir) {
				list.push(slice(node.path))
			}
			list = list.concat(tree2list(node, opt))
		} else {
			list.push(slice(node.path))
		}
	})
	return list
}

export { tree, tree2list }
