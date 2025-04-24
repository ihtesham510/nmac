import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const blurVarients = cva(
	'absolute inset-0 size-full animate-pulse rounded-full bg-blue-500 opacity-10 blur-2xl',
	{
		variants: {
			variant: {
				default: 'bg-blue-500',
				destructive: 'bg-destructive animate-none',
				live: 'bg-green-400 animate-none',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)
const borderVarients = cva(
	'relative flex justify-center items-center cursor-pointer rounded-full size-28 border-1',
	{
		variants: {
			variant: {
				default: 'border-blue-500',
				destructive: 'border-destructive',
				live: 'border-green-400',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

const innerBlurVarient = cva(
	'absolute inset-0 size-full rounded-full border-[3px] shadow-inner',
	{
		variants: {
			variant: {
				default: 'border-blue-500 shadow-blue-900',
				destructive: 'border-destructive shadow-red-900',
				live: 'border-green-400 shadow-green-900',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

const iconVarient = cva('size-10', {
	variants: {
		variant: {
			default: 'text-blue-500',
			destructive: 'text-destructive',
			live: 'text-green-400',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

type Props = {
	onClick?: () => void
} & VariantProps<typeof blurVarients> &
	VariantProps<typeof borderVarients>

export function BotButton({ onClick, variant }: Props) {
	return (
		<div onClick={onClick} className={cn(borderVarients({ variant }))}>
			<div className={cn(blurVarients({ variant }))} />
			<div className={cn(innerBlurVarient({ variant }))}></div>
			<Bot className={cn(iconVarient({ variant }))} />
		</div>
	)
}
