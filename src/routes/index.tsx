import { createFileRoute, Link } from '@tanstack/react-router'
import { LoaderComponent } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	const auth = useAuth()
	if (auth.isLoading) return <LoaderComponent />
	return (
		<div className='flex h-screen w-full items-center justify-center'>
			{auth.isAuthenticated ? (
				<Link to='/dashboard'>
					<Button>Go to Dashboard</Button>
				</Link>
			) : (
				<Link to='/sign-in'>
					<Button>Sign In</Button>
				</Link>
			)}
		</div>
	)
}
