import path from 'path'

/** @typedef {Object} Node
 *  @property {Node[]} [children]
 *  @property {string} path
 */

/** @typedef {Object} Options
 *  @property {number} [sliceHead]
 *  @property {number} [sliceTail]
 */

/** @param {Node[]} tree
 *  @param {Options} [opt]
 *  @returns {string[]}
 */
export default function tree2list(tree, opt){
	let list = []
	tree.children.forEach(node => {
		if(node.children){
			list.push(...tree2list(node, opt))
		}
		else{
			/** @type string[] */
			let fragments = node.path.split(path.sep)
			fragments = fragments.slice(opt?.sliceHead||0, opt?.sliceTail||fragments.length)
			list.push(path.join('/', ...fragments))
		}
	})
	return list
}

// import Tree from 'directory-tree'
// const tree = Tree('./content/')
// console.log(JSON.stringify(tree, undefined, 2))
// console.log(tree2list(tree, {
//     sliceHead: 0
// }))
