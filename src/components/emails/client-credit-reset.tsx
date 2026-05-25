import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components'
import type { Clients } from '@/lib/types'

export const SubscriptionResetEmail = (props: Clients[0]) => {
	const { name, subscription } = props

	const getTierName = (type: 'base' | 'pro' | 'business') => {
		switch (type) {
			case 'base':
				return 'Base'
			case 'pro':
				return 'Pro'
			case 'business':
				return 'Business'
		}
	}

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	return (
		<Html lang='en' dir='ltr'>
			<Tailwind>
				<Head />
				<Preview>
					Your monthly credits have been successfully reset -{' '}
					{(subscription?.total_credits ?? 0).toString()} credits now available
				</Preview>
				<Body className='bg-gray-100 py-[40px] font-sans'>
					<Container className='mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm'>
						{/* Header */}
						<Section className='mb-[32px] text-center'>
							<Heading className='m-0 mb-[8px] font-bold text-[28px] text-gray-900'>
								Credits Reset Successfully
							</Heading>
							<Text className='m-0 text-[16px] text-gray-600'>
								Your monthly subscription credits have been renewed
							</Text>
						</Section>

						{/* Greeting */}
						<Section className='mb-[32px]'>
							<Text className='m-0 mb-[16px] text-[16px] text-gray-900'>
								Hello {name},
							</Text>
							<Text className='m-0 text-[16px] text-gray-700 leading-[24px]'>
								Great news! Your monthly credits have been successfully reset
								and are now available for use. Your{' '}
								{getTierName(subscription!.type)} subscription continues to
								provide you with powerful features and resources.
							</Text>
						</Section>

						{/* Subscription Details */}
						<Section className='mb-[32px] rounded-[8px] bg-gray-50 p-[24px]'>
							<Heading className='m-0 mb-[16px] font-bold text-[20px] text-gray-900'>
								Subscription Details
							</Heading>
							<div className='space-y-[12px]'>
								<div className='flex items-center justify-between'>
									<Text className='m-0 text-[14px] text-gray-600'>Plan:</Text>
									<Text className='m-0 font-semibold text-[14px] text-gray-900'>
										{getTierName(subscription!.type)} Plan
									</Text>
								</div>
								<div className='flex items-center justify-between'>
									<Text className='m-0 text-[14px] text-gray-600'>
										Monthly Credits:
									</Text>
									<Text className='m-0 font-semibold text-[14px] text-green-600'>
										{subscription?.total_credits} credits
									</Text>
								</div>
								<div className='flex items-center justify-between'>
									<Text className='m-0 text-[14px] text-gray-600'>
										Available Credits:
									</Text>
									<Text className='m-0 font-semibold text-[14px] text-green-600'>
										{subscription?.remaining_credits} credits
									</Text>
								</div>
								<div className='flex items-center justify-between'>
									<Text className='m-0 text-[14px] text-gray-600'>
										Reset Date:
									</Text>
									<Text className='m-0 font-semibold text-[14px] text-gray-900'>
										{formatDate(subscription!.updatedAt)}
									</Text>
								</div>
							</div>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
