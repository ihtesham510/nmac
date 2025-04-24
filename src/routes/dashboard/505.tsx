import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/505')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/505"!</div>
}
