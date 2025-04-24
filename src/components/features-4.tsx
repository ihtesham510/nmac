import {
	ContactRound,
	FileChartPie,
	Handshake,
	Milestone,
	PhoneForwarded,
	UserSearch,
} from 'lucide-react'

export default function AssistantFeatures() {
	return (
		<section className='py-12 md:py-20' id='solutions'>
			<div className='mx-auto max-w-5xl space-y-8 px-6 md:space-y-16'>
				<div className='relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12'>
					<h2 className='text-balance text-4xl font-medium lg:text-5xl'>
						Automate, Optimize and Scale Your Businesses With AI-Automations.
					</h2>
					<p>
						Automate tasks, optimize workflows, and scale your business
						effortlessly with <strong>AI-powered solutions</strong>. Let AI
						handle the work so you can focus on growth and innovation.
					</p>
				</div>

				<div className='relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3'>
					<div className='space-y-3'>
						<div className='flex items-center gap-2'>
							<ContactRound className='size-4' />
							<h3 className='text-sm font-medium'>Social Media Assistant.</h3>
						</div>
						<p className='text-sm'>
							Create your <strong>AI social media assistant</strong> to scale
							your content strategy and engagement.
						</p>
					</div>
					<div className='space-y-2'>
						<div className='flex items-center gap-2'>
							<Handshake className='size-4' />
							<h3 className='text-sm font-medium'>Support Assistant.</h3>
						</div>
						<p className='text-sm'>
							Create your <strong>AI sales assistant</strong> to scale your lead
							generation and conversions.
						</p>
					</div>
					<div className='space-y-2'>
						<div className='flex items-center gap-2'>
							<UserSearch className='size-4' />

							<h3 className='text-sm font-medium'>Sales Assistant.</h3>
						</div>
						<p className='text-sm'>
							Create your <strong>AI sales assistant</strong> to scale your lead
							generation and conversions.
						</p>
					</div>
					<div className='space-y-2'>
						<div className='flex items-center gap-2'>
							<FileChartPie className='size-4' />

							<h3 className='text-sm font-medium'>Database Assistant.</h3>
						</div>
						<p className='text-sm'>
							Build your <strong>AI database reactivation assistant</strong> to
							re-engage inactive customers and boost retention.
						</p>
					</div>
					<div className='space-y-2'>
						<div className='flex items-center gap-2'>
							<PhoneForwarded className='size-4' />

							<h3 className='text-sm font-medium'>Pre-Call Assistant.</h3>
						</div>
						<p className='text-sm'>
							Create your <strong>AI pre-call assistant</strong> to analyze
							prospects and optimize sales conversations.
						</p>
					</div>
					<div className='space-y-2'>
						<div className='flex items-center gap-2'>
							<Milestone className='size-4' />

							<h3 className='text-sm font-medium'>
								Post-Call Nurture Assistant.
							</h3>
						</div>
						<p className='text-sm'>
							Build your <strong>AI post-call nurture assistant</strong> to
							follow up and strengthen customer relationships.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
