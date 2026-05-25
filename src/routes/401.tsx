import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/401')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='flex h-screen w-full items-center justify-center'>
			<div className='flex flex-col items-center space-y-6'>
				<AlertTriangle className='size-24' />
				<div className='grid justify-items-center space-y-2'>
					<h1 className='font-bold text-4xl'>Not Authorized</h1>
					<h1 className='max-w-lg text-center font-semibold text-primary/50 text-xl'>
						You don't have permission to access this page. Please log in with
						the correct credentials or contact support if you believe this is a
						mistake.
					</h1>
				</div>
			</div>
		</div>
	)
}
