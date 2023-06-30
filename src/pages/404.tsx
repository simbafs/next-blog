import TerminalLayout from "@/layouts/terminal"
import Terminal from "@/components/terminal"

export default function NotFound() {
	return <TerminalLayout title="404" description="Page Not Found">
		<Terminal initCmd={[['banner404']]} />
	</TerminalLayout>
}
