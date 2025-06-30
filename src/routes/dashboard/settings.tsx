import { createFileRoute } from '@tanstack/react-router'
import { Profile } from '@/components/settings/profile'

export const Route = createFileRoute('/dashboard/settings')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='grid p-10 gap-10 w-full h-auto'>
			<h1 className='text-4xl font-bold'>Settings</h1>
			<div>
				<Profile />
			</div>
		</div>
	)
}
