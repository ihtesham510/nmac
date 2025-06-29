import { UnProtectedRoute } from '@/hoc/unprotected-route'
import { createFileRoute, Link } from '@tanstack/react-router'
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
						You have used you're monthly limit,{' '}
						<Link
							to='/pricing'
							className='text-primary hover:underline underline-offset-6'
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
