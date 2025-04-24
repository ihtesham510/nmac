import { useAuth } from '@/context/auth-context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	const auth = useAuth()
	return (
		<div className='w-full'>
			<pre>{JSON.stringify(auth.user, null, 2)}</pre>
		</div>
	)
}
