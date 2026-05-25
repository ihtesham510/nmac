import { createFileRoute } from '@tanstack/react-router'
import { Profile } from '@/components/settings/profile'

export const Route = createFileRoute('/dashboard/settings')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='grid h-auto w-full gap-10 p-10'>
			<h1 className='font-bold text-4xl'>Settings</h1>
			<div>
				<Profile />
			</div>
		</div>
	)
}
