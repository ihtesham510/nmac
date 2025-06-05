import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/401')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='h-screen w-full flex justify-center items-center'>
			<div className='flex flex-col items-center space-y-6'>
				<AlertTriangle className='size-24' />
				<div className='grid space-y-2 justify-items-center'>
					<h1 className='text-4xl font-bold'>Not Authorized</h1>
					<h1 className='text-xl font-semibold text-primary/50 max-w-lg text-center'>
						You don't have permission to access this page. Please log in with
						the correct credentials or contact support if you believe this is a
						mistake.
					</h1>
				</div>
			</div>
		</div>
	)
}
