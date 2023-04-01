import fs from 'fs/promises'
import { join, sep } from 'path'

/** @typedef {Object} Node
 *  @property {string} name
 *  @property {string} path
 *  @property {('file'|'directory')} type
 *  @property {Node} [child]
 */

/** @param {string} root
 *  @param {Object} [opt]
 *  @param {string[]} [opt.extensions]
 *  @returns {Node}
 */
async function tree(root, opt) {
	root = join(root)
	const item = await fs.readdir(root)
	const nodes = (
		await Promise.all(
			item.map(async name => {
				const path = join(root, name)
				const stat = await fs.stat(path)
				if (stat.isDirectory()) {
					return tree(path, opt)
				}
				if (
					opt.extensions &&
					!opt.extensions.some(i => name.endsWith(i))
				) {
					return
				}
				return {
					name,
					path,
					type: 'file',
					children: null,
				}
			})
		)
	).filter(i => i)
	return {
		name: root,
		path: root,
		type: 'directory',
		children: nodes,
	}
}

/** @param {Node} tree
 *  @param {Object} [opt]
 *  @param {number} [opt.sliceHead]
 *  @param {number} [opt.sliceTail]
 *  @returns {string[]}
 */
function tree2list(tree, opt) {
	// console.log(tree)
	let list = []
	tree?.children.forEach(node => {
		if (node.type === 'directory') {
			list = list.concat(tree2list(node, opt))
		} else {
			const fragments = node.path.split(sep)
			list.push(
				fragments
					.slice(
						opt.sliceHead || 0,
						fragments.length - (opt.sliceTail || 0)
					)
					.join('/')
			)
		}
	})
	return list
}

export { tree, tree2list }
