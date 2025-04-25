import { createFileRoute } from '@tanstack/react-router'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Profile } from '@/components/settings/profile'

export const Route = createFileRoute('/dashboard/settings')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='grid p-10 gap-10 w-full h-auto'>
			<h1 className='text-4xl font-bold'>Settings</h1>
			<div>
				<Tabs defaultValue='profile'>
					<TabsList>
						<TabsTrigger value='profile'>Profile</TabsTrigger>
						<TabsTrigger value='account'>Account</TabsTrigger>
					</TabsList>
					<TabsContent value='profile'>
						<Profile />
					</TabsContent>
					<TabsContent value='account'></TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
