import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { UnProtectedRoute } from '@/hoc/unprotected-route'

export const Route = createFileRoute('/422')({
	component: () => (
		<UnProtectedRoute>
			<RouteComponent />
		</UnProtectedRoute>
	),
})

function RouteComponent() {
	return (
		<div className='flex h-screen w-full items-center justify-center'>
			<div className='flex flex-col items-center space-y-6'>
				<AlertTriangle className='size-24' />
				<div className='grid justify-items-center space-y-2'>
					<h1 className='font-bold text-4xl'>Insufficient Credits</h1>
					<h1 className='max-w-lg text-center font-semibold text-primary/50 text-xl'>
						You have used you're monthly limit,{' '}
						<Link
							to='/pricing'
							className='text-primary underline-offset-6 hover:underline'
						>
							upgrade
						</Link>{' '}
						your account to add more credits.
					</h1>
				</div>
			</div>
		</div>
	)
}
