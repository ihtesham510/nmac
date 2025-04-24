export function FAQs() {
	return (
		<section className='scroll-py-16 py-16 md:scroll-py-32 md:py-32' id='faqs'>
			<div className='mx-auto max-w-5xl px-6'>
				<div className='grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]'>
					<div className='text-center lg:text-left'>
						<h2 className='mb-4 text-3xl font-semibold md:text-4xl'>
							Frequently <br className='hidden lg:block' /> Asked{' '}
							<br className='hidden lg:block' />
							Questions
						</h2>
						<p>Haven't Found What You're Looking For ? Contact Us.</p>
					</div>

					<div className='divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0'>
						<div className='pb-6'>
							<h3 className='font-medium'>What is an AI assistant?</h3>
							<p className='text-muted-foreground mt-4'>
								An AI assistant is a software application powered by artificial
								intelligence that helps manage tasks, provide information, and
								assist with various functions through natural language
								processing and machine learning.
							</p>
						</div>
						<div className='py-6'>
							<h3 className='font-medium'>How does an AI assistant work?</h3>
							<p className='text-muted-foreground mt-4'>
								AI assistants use algorithms and machine learning to understand
								and process user inputs, execute tasks, and provide responses.
								They interact through voice commands or text and can perform
								functions like scheduling, reminders, and information retrieval.
							</p>
						</div>
						<div className='py-6'>
							<h3 className='font-medium'>
								What tasks can an AI assistant perform?
							</h3>
							<p className='text-muted-foreground my-4'>
								AI assistants can handle a wide range of tasks, including
								managing calendars, setting reminders, sending messages,
								answering questions, providing weather updates, and integrating
								with other applications and services.
							</p>
						</div>
						<div className='py-6'>
							<h3 className='font-medium'>
								How secure is my data with an AI assistant?
							</h3>
							<p className='text-muted-foreground mt-4'>
								Most AI assistants use encryption and other security measures to
								protect your data. However, it's essential to review the privacy
								policies of the service and be mindful of the information you
								share.
							</p>
						</div>
						<div className='py-6'>
							<h3 className='font-medium'>
								Can AI assistants access personal information?
							</h3>
							<p className='text-muted-foreground mt-4'>
								AI assistants can access personal information you provide, such
								as calendar events and contacts, to perform their functions.
								It’s important to manage permissions and understand how your
								data is used and stored.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
