import { createFileRoute } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { useProjetSettings } from '@/context/project-setting-context'
import { UpdateAgentSettingsForm } from '@/components/agent-config/update-agent-settings-form'

export const Route = createFileRoute('/dashboard/project-settings/agent')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = useProjetSettings()
	return (
		<div>
			{agent.isLoading && (
				<div className='flex w-full h-[40vh] justify-center items-center'>
					<LoaderCircle className='size-8 animate-spin' />
				</div>
			)}
			{agent.data && (
				<UpdateAgentSettingsForm data={agent.data} key={agent.dataUpdatedAt} />
			)}
		</div>
	)
}
