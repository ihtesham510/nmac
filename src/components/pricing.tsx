import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { StarsBackground } from './ui/stars-background'
import { RainbowButton } from './magicui/rainbow-button'

interface Props {
	subscription?: 'base' | 'pro' | 'business'
}

export default function Pricing({
	className,
	subscription,
}: { className?: string } & Props) {
	return (
		<StarsBackground className={className} factor={0.1}>
			<section className='py-16 md:py-32 relative' id='pricing'>
				<div className='mx-auto max-w-6xl px-6'>
					<div className='mx-auto max-w-2xl space-y-6 text-center'>
						<h1 className='text-center text-4xl font-semibold lg:text-5xl'>
							Pricing that Scales with You
						</h1>
						<p>
							Gemini is evolving to be more than just the models. It supports an
							entire to the APIs and platforms helping developers and businesses
							innovate.
						</p>
					</div>

					<div className='mt-8 grid gap-6 md:mt-20 md:grid-cols-3'>
						<Card>
							<CardHeader>
								<CardTitle className='font-medium'>Base</CardTitle>
								<span className='my-3 block text-2xl font-semibold'>
									$9.99 / mo
								</span>
								<Button
									asChild
									variant='outline'
									className='mt-4 w-full'
									disabled={subscription === 'base'}
								>
									<Link to='.'>
										{subscription
											? 'Down Grade'
											: subscription === 'base'
												? 'current'
												: 'Subscribe'}
									</Link>
								</Button>
							</CardHeader>

							<CardContent className='space-y-4'>
								<hr className='border-dashed' />

								<ul className='list-outside space-y-3 text-sm'>
									{['30,000 credits'].map((item, index) => (
										<li key={index} className='flex items-center gap-2'>
											<Check className='size-3' />
											{item}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						<Card className='relative mt-[-20px] mb-[20px]'>
							<RainbowButton className='absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium'>
								Popular
							</RainbowButton>

							<CardHeader>
								<CardTitle className='font-medium'>Pro</CardTitle>

								<span className='my-3 block text-2xl font-semibold'>
									$19.99 / mo
								</span>

								<Button asChild className='mt-4 w-full'>
									<Link to='.'>
										{subscription
											? 'Down Grade'
											: subscription === 'base'
												? 'current'
												: 'Subscribe'}
									</Link>
								</Button>
							</CardHeader>

							<CardContent className='space-y-4'>
								<hr className='border-dashed' />

								<ul className='list-outside space-y-3 text-sm'>
									{['60,000 credits'].map((item, index) => (
										<li key={index} className='flex items-center gap-2'>
											<Check className='size-3' />
											{item}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						<Card className='flex flex-col'>
							<CardHeader>
								<CardTitle className='font-medium'>Business</CardTitle>

								<span className='my-3 block text-2xl font-semibold'>
									$29.99 / mo
								</span>

								<Button asChild variant='outline' className='mt-4 w-full'>
									<Link to='.'>
										{subscription
											? 'Down Grade'
											: subscription === 'base'
												? 'current'
												: 'Subscribe'}
									</Link>
								</Button>
							</CardHeader>

							<CardContent className='space-y-4'>
								<hr className='border-dashed' />

								<ul className='list-outside space-y-3 text-sm'>
									{['120,000 credits'].map((item, index) => (
										<li key={index} className='flex items-center gap-2'>
											<Check className='size-3' />
											{item}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</StarsBackground>
	)
}
