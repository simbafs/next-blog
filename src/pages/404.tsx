import Terminal from "@/components/terminal"
import TerminalLayout from "@/layouts/terminal"

export default function NotFound() {
	return <TerminalLayout title="404" description="Page Not Found">
		<Terminal initCmd={['banner404']} />
	</TerminalLayout>
}
