import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
	Tailwind,
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
					{subscription!.total_credits.toString()} credits now available
				</Preview>
				<Body className='bg-gray-100 font-sans py-[40px]'>
					<Container className='bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]'>
						{/* Header */}
						<Section className='text-center mb-[32px]'>
							<Heading className='text-[28px] font-bold text-gray-900 m-0 mb-[8px]'>
								Credits Reset Successfully
							</Heading>
							<Text className='text-[16px] text-gray-600 m-0'>
								Your monthly subscription credits have been renewed
							</Text>
						</Section>

						{/* Greeting */}
						<Section className='mb-[32px]'>
							<Text className='text-[16px] text-gray-900 m-0 mb-[16px]'>
								Hello {name},
							</Text>
							<Text className='text-[16px] text-gray-700 m-0 leading-[24px]'>
								Great news! Your monthly credits have been successfully reset
								and are now available for use. Your{' '}
								{getTierName(subscription!.type)} subscription continues to
								provide you with powerful features and resources.
							</Text>
						</Section>

						{/* Subscription Details */}
						<Section className='bg-gray-50 rounded-[8px] p-[24px] mb-[32px]'>
							<Heading className='text-[20px] font-bold text-gray-900 m-0 mb-[16px]'>
								Subscription Details
							</Heading>
							<div className='space-y-[12px]'>
								<div className='flex justify-between items-center'>
									<Text className='text-[14px] text-gray-600 m-0'>Plan:</Text>
									<Text className='text-[14px] font-semibold text-gray-900 m-0'>
										{getTierName(subscription!.type)} Plan
									</Text>
								</div>
								<div className='flex justify-between items-center'>
									<Text className='text-[14px] text-gray-600 m-0'>
										Monthly Credits:
									</Text>
									<Text className='text-[14px] font-semibold text-green-600 m-0'>
										{subscription!.total_credits} credits
									</Text>
								</div>
								<div className='flex justify-between items-center'>
									<Text className='text-[14px] text-gray-600 m-0'>
										Available Credits:
									</Text>
									<Text className='text-[14px] font-semibold text-green-600 m-0'>
										{subscription!.remaining_credits} credits
									</Text>
								</div>
								<div className='flex justify-between items-center'>
									<Text className='text-[14px] text-gray-600 m-0'>
										Reset Date:
									</Text>
									<Text className='text-[14px] font-semibold text-gray-900 m-0'>
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
