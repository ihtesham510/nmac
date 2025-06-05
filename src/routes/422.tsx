import { UnProtectedRoute } from '@/hoc/unprotected-route'
import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/422')({
	component: () => (
		<UnProtectedRoute>
			<RouteComponent />
		</UnProtectedRoute>
	),
})

function RouteComponent() {
	return (
		<div className='h-screen w-full flex justify-center items-center'>
			<div className='flex flex-col items-center space-y-6'>
				<AlertTriangle className='size-24' />
				<div className='grid space-y-2 justify-items-center'>
					<h1 className='text-4xl font-bold'>Insufficient Credits</h1>
					<h1 className='text-xl font-semibold text-primary/50 max-w-lg text-center'>
						You have very little credits left in you're account, Contact the
						Administrator to add more credits
					</h1>
				</div>
			</div>
		</div>
	)
}
