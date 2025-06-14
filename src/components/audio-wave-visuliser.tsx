import React, { useState, useEffect, useRef } from 'react'
import { Skeleton } from './ui/skeleton'
import { useWavesurfer } from '@wavesurfer/react'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Download } from 'lucide-react'

interface AudioPlayerProps {
	audioBlob: Blob
	open?: boolean
	isLoading?: boolean
}

const formatTime = (seconds: number): string => {
	if (isNaN(seconds)) return '0:00'
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
	audioBlob,
	open = true,
	isLoading,
}) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [audioUrl, setAudioUrl] = useState<string>('')
	const mergedTheme = {
		waveColor: 'gray',
		progressColor: 'white',
		backgroundColor: 'transparent',
		height: 70,
		cursorColor: '#ffffff',
		barWidth: 2,
		barGap: 1,
		barRadius: 4,
	}

	const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
		container: containerRef,
		url: audioUrl,
		waveColor: mergedTheme.waveColor,
		progressColor: mergedTheme.progressColor,
		cursorColor: mergedTheme.cursorColor,
		height: mergedTheme.height,
		barWidth: mergedTheme.barWidth,
		barGap: mergedTheme.barGap,
		barRadius: mergedTheme.barRadius,
		normalize: true,
		backend: 'WebAudio',
	})

	const [duration, setDuration] = useState(0)

	// Cleanup function
	const cleanup = () => {
		if (wavesurfer) {
			if (isPlaying) {
				wavesurfer.pause()
			}
			wavesurfer.destroy()
		}
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl)
			setAudioUrl('')
		}
		setDuration(0)
	}

	// Handle open prop changes
	useEffect(() => {
		if (!open) {
			cleanup()
		}
	}, [open, wavesurfer, isPlaying, audioUrl])

	// Create blob URL
	useEffect(() => {
		if (open && audioBlob) {
			const url = URL.createObjectURL(audioBlob)
			setAudioUrl(url)
		}

		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl)
			}
		}
	}, [audioBlob, open])

	// Set duration when ready
	useEffect(() => {
		if (isReady && wavesurfer) {
			setDuration(wavesurfer.getDuration())
		}
	}, [isReady, wavesurfer])

	const onPlayPause = () => {
		if (wavesurfer) {
			wavesurfer.playPause()
		}
	}

	const seekBackward = () => {
		if (wavesurfer && duration > 0) {
			const newTime = Math.max(0, currentTime - 10)
			wavesurfer.seekTo(newTime / duration)
		}
	}

	const seekForward = () => {
		if (wavesurfer && duration > 0) {
			const newTime = Math.min(duration, currentTime + 10)
			wavesurfer.seekTo(newTime / duration)
		}
	}

	const handleDownload = () => {
		// Default download behavior
		const link = document.createElement('a')
		link.href = audioUrl
		link.download = 'audio'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	if (!open || !audioUrl) {
		return null
	}

	if (isLoading) return <AudioPlayerSkeleton />

	return (
		<div
			className='mx-1 flex flex-col gap-2'
			style={{ backgroundColor: mergedTheme.backgroundColor }}
		>
			<div className='mb-4 hidden lg:block'>
				<div ref={containerRef} />
			</div>

			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-2'>
					<Button onClick={onPlayPause} disabled={!isReady}>
						{isPlaying ? (
							<Pause className='size-4' />
						) : (
							<Play className='size-4' />
						)}
					</Button>

					<Button variant='ghost' onClick={seekBackward} disabled={!isReady}>
						<SkipBack className='size-4' />
					</Button>

					<Button variant='ghost' onClick={seekForward} disabled={!isReady}>
						<SkipForward className='size-4' />
					</Button>
				</div>

				{/* Right Controls */}
				<div className='flex items-center space-x-3'>
					{/* Time Display */}
					<div className='text-sm font-mono text-muted-foreground min-w-[80px] text-center'>
						<span>{formatTime(currentTime)}</span>
						<span className='mx-1'>/</span>
						<span>{formatTime(duration)}</span>
					</div>

					<Button
						variant='outline'
						onClick={handleDownload}
						title='Download audio'
					>
						<Download className='size-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}

export const AudioPlayerSkeleton = () => {
	return (
		<div className='mx-1 flex flex-col gap-2'>
			{/* Waveform Skeleton - Hidden on small screens */}
			<div className='mb-4 hidden lg:block'>
				<Skeleton className='h-[70px] w-full rounded-md' />
			</div>

			{/* Controls */}
			<div className='flex items-center justify-between'>
				{/* Left Controls */}
				<div className='flex items-center space-x-2'>
					<Skeleton className='h-9 w-9 rounded-md' />
					<Skeleton className='h-9 w-9 rounded-md' />
					<Skeleton className='h-9 w-9 rounded-md' />
				</div>

				{/* Right Controls */}
				<div className='flex items-center space-x-3'>
					{/* Time Display Skeleton */}
					<div className='min-w-[80px] text-center'>
						<Skeleton className='h-4 w-16 mx-auto' />
					</div>
					<Skeleton className='h-9 w-9 rounded-md' />
				</div>
			</div>
		</div>
	)
}
