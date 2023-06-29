// import LinkList from '@/components/linkList'
import Terminal from '@/components/terminal'
import TerminalLayout from '@/layouts/terminal'
// import { tree, tree2list } from '@/lib/tree'

export default function Home(/*{ posts }: {
	posts: string[]
}*/) {
	return (
		<TerminalLayout title="Home" description="Home">
			<Terminal initCmd={[['banner']]} />
			{/* <LinkList list={posts} /> */}
		</TerminalLayout>
	)
}

// export async function getStaticProps() {
// 	const posts = tree2list(
// 		await tree('content', { extensions: ['.md'] }),
// 		{
// 			sliceHead: 1,
// 			expandDir: false,
// 		}
// 	)
// 	return { props: { posts } }
// }
