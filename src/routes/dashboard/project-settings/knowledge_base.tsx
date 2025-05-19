import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/project-settings/knowledge_base',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/project-settings/knowledge_base"!</div>
}
