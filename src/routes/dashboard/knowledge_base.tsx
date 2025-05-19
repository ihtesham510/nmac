import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	TableCaption,
} from '@/components/ui/table'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from '@/components/ui/tooltip'
import { createFileRoute } from '@tanstack/react-router'
import {
	FileText,
	Users,
	MoreHorizontal,
	LoaderCircle,
	CopyIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { GetKnowledgeBaseListResponseModel } from 'elevenlabs/api'
import { useQuery } from '@tanstack/react-query'
import { queries } from '@/api/query-options'
import { toast } from 'sonner'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { useElevenLabsClient } from '@/api/client'

export const Route = createFileRoute('/dashboard/knowledge_base')({
	component: RouteComponent,
})

function RouteComponent() {
	const client = useElevenLabsClient()
	const knowledge_base = useQuery(queries.list_knoledge_base(client, {}))

	return (
		<div className='h-screen w-full'>
			<div className='m-10 grid gap-6 space-y-6'>
				<div className='grid gap-2'>
					<h1 className='text-4xl font-bold'>Knowledge Base</h1>
					<p className='font-semibold text-primary/50'>
						Add, manage and assign Knowledge base to agents.
					</p>
				</div>
				{knowledge_base.isLoading && (
					<div className='flex justify-center items-center h-[60vh] w-full'>
						<LoaderCircle className='size-8' />
					</div>
				)}
				{!knowledge_base.isLoading && knowledge_base.data && (
					<div className='w-full h-auto'>
						<DocumentsTable documents={knowledge_base.data} />
					</div>
				)}
			</div>
		</div>
	)
}

function DocumentsTable({
	documents,
}: {
	documents: GetKnowledgeBaseListResponseModel
}) {
	return (
		<Table>
			<TableCaption className='text-primary/30'>
				A list of your Knowledge Base.
			</TableCaption>
			<TableHeader className='bg-muted/40 h-[50px]'>
				<TableRow>
					<TableHead className='pl-4'>Name</TableHead>
					<TableHead>Injectable</TableHead>
					<TableHead>Size</TableHead>
					<TableHead>Agents</TableHead>
					<TableHead>Created By</TableHead>
					<TableHead>Last Updated</TableHead>
					<TableHead className='text-right pr-4'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{documents.documents.map(doc => (
					<Sheet>
						<SheetTrigger asChild>
							<TableRow key={doc.id} className='cursor-pointer'>
								<TableCell className='pl-4'>
									<div className='flex items-center gap-3'>
										<FileText className='h-4 w-4 text-primary' />
										<span className='font-medium'>{doc.name}</span>
									</div>
								</TableCell>
								<TableCell>
									{doc.prompt_injectable ? (
										<Badge
											variant='outline'
											className='bg-green-500/10 text-green-500 hover:bg-green-500/20'
										>
											Yes
										</Badge>
									) : (
										<Badge
											variant='outline'
											className='bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
										>
											No
										</Badge>
									)}
								</TableCell>
								<TableCell className='text-sm'>
									{formatFileSize(doc.metadata.size_bytes)}
								</TableCell>
								<TableCell>
									{doc.dependent_agents.length > 0 ? (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<div className='flex items-center gap-1'>
														<Users className='h-4 w-4 text-muted-foreground' />
														<span>{doc.dependent_agents.length}</span>
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<div className='space-y-2'>
														<p className='font-medium'>Dependent Agents:</p>
														<ul className='text-sm'>
															{doc.dependent_agents.map((agent: any) => (
																<li
																	key={agent.id}
																	className='flex items-center gap-2'
																>
																	<span>• {agent.name}</span>
																</li>
															))}
														</ul>
													</div>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									) : (
										<span className='text-muted-foreground text-sm'>None</span>
									)}
								</TableCell>

								<TableCell>
									<div className='flex items-center gap-2'>
										<div className='flex flex-col'>
											<span className='text-sm'>
												{doc.access_info.creator_name}
											</span>
											<span className='text-xs text-muted-foreground'>
												{doc.access_info.role}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell className='text-sm'>
									{format(
										new Date(doc.metadata.last_updated_at_unix_secs * 1000),
										'MMM d, yyyy',
									)}
								</TableCell>
								<TableCell className='text-right pr-4'>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant='ghost' size='icon' className='h-8 w-8'>
												<MoreHorizontal className='h-4 w-4' />
												<span className='sr-only'>Open menu</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuItem
												onClick={async () => {
													await navigator.clipboard.writeText(doc.id)
													toast.success('Copied Document Id')
												}}
											>
												<CopyIcon className='h-4 w-4 mr-2' />
												Copy Document Id
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						</SheetTrigger>
					</Sheet>
				))}
			</TableBody>
		</Table>
	)
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return bytes + ' B'
	else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
	else if (bytes < 1024 * 1024 * 1024)
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
	else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}
