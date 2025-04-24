import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents/404')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/agents/404"!</div>
}
