import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/knowledge_base')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/knowledge_base"!</div>
}
