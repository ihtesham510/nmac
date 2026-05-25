import { createFileRoute } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { UpdateAgentSettingsForm } from '@/components/agent-config/update-agent-settings-form'
import { useProjetSettings } from '@/context/project-setting-context'

export const Route = createFileRoute('/dashboard/project-settings/agent')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = useProjetSettings()
	return (
		<div>
			{agent.isLoading && (
				<div className='flex h-[40vh] w-full items-center justify-center'>
					<LoaderCircle className='size-8 animate-spin' />
				</div>
			)}
			{agent.data && (
				<UpdateAgentSettingsForm data={agent.data} key={agent.dataUpdatedAt} />
			)}
		</div>
	)
}
