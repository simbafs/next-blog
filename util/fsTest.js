import { tree as Tree, tree2list as Tree2list } from './tree'

export async function tree(root, opt) {
	return await Tree(root, opt)
}

export function tree2list(tree, opt) {
	return Tree2list(tree, opt)
}

// import fs from 'fs/promises'

// export default async function dirs(){
//     return await fs.readdir(`${process.cwd()}/content`)
// }
