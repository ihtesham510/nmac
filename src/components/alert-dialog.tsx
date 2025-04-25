// components/alert-dialog.tsx
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useLogger } from '@mantine/hooks'
import { useState } from 'react'

export interface AlertProps {
	dialogTitle: string
	dialogDescription: string
	onConfirm?: () => void
	onOpenChange?: (open: boolean) => void
}

export function Alert({
	dialogTitle,
	dialogDescription,
	onConfirm,
	onOpenChange,
}: AlertProps) {
	const [open, setOpen] = useState(true)

	const handleOpenChange = (value: boolean) => {
		setOpen(value)
		onOpenChange?.(value)
	}

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
					<AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							if (onConfirm) {
								onConfirm()
							}
							setOpen(false)
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
