import fs from 'fs'
import path from 'path'

/** @typedef {object} WalkOptions 
 *  @property {string} pattern
 */

/** @param {string} dir 
 *  @param {WalkOptions} opt
 */
export default async function walk(dir, opt){
	dir = path.resolve(dir)

	let paths = fs.readdirSync(dir)
	let files = paths.filter(i => {
		let stat = fs.statSync(path.join(dir, i))
		let isFile = stat.isFile()
		return isFile
	})
	let dirs = paths.filter(i => !files.includes(i))

	if(opt?.pattern){
		let pattern = new RegExp(opt.pattern)
		files = files.filter(i => pattern.test(i))
	}

	let childFiles = await Promise.all(dirs.map(i => walk(path.join(dir, i), opt)))
	let tree
	return files.concat(...childFiles)
}

// walk('./content', {pattern: '\\.md$'}).then(console.log)
walk('./content', {pattern: /\.md$/}).then(console.log)
