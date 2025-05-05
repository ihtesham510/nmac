import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/project-settings/')({
	component: () => <Navigate to='/dashboard/project-settings/agent' />,
})
