import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/505')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/505"!</div>
}
