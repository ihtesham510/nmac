import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

interface ConfirmDeleteDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title?: string
	description?: string
	onConfirm: () => Promise<void> | void
	itemName?: string
	isLoading?: boolean
}

export function WarnDialog({
	open,
	onOpenChange,
	title,
	description,
	onConfirm,
	itemName = 'item',
	isLoading: externalLoading = false,
}: ConfirmDeleteDialogProps) {
	const [internalLoading, setInternalLoading] = useState(false)
	const isLoading = externalLoading || internalLoading

	const handleConfirm = async () => {
		try {
			setInternalLoading(true)
			await onConfirm()
			onOpenChange(false)
		} catch (error) {
			console.error('Delete operation failed:', error)
		} finally {
			setInternalLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title || `Delete ${itemName}?`}</DialogTitle>
					<DialogDescription>
						{description ||
							`This action cannot be undone. This will permanently delete this ${itemName.toLowerCase()} and remove the data from our servers.`}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
						className='cursor-pointer'
					>
						Cancel
					</Button>
					<Button
						type='button'
						size='sm'
						variant='destructive'
						className='cursor-pointer'
						onClick={handleConfirm}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<LoaderCircle className='mr-2 size-4 animate-spin' />
								Deleting...
							</>
						) : (
							'Delete'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
