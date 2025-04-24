import { useEffect, useRef } from 'react'
import { type LucideIcon } from 'lucide-react'

interface FaviconUpdaterProps {
	icon: LucideIcon
	title: string
	iconSize?: number
}

function FaviconUpdater({
	icon: Icon,
	title,
	iconSize = 32,
}: FaviconUpdaterProps) {
	const iconRef = useRef<HTMLDivElement>(null)

	// Update document title
	useEffect(() => {
		document.title = title
	}, [title])

	// Update favicon
	useEffect(() => {
		if (!Icon) return

		const svgElement = iconRef.current?.querySelector('svg')
		if (!svgElement) return

		// Set SVG attributes for favicon
		svgElement.setAttribute('width', iconSize.toString())
		svgElement.setAttribute('height', iconSize.toString())

		// Serialize SVG to string
		const svgString = new XMLSerializer().serializeToString(svgElement)
		const blob = new Blob([svgString], { type: 'image/svg+xml' })
		const url = URL.createObjectURL(blob)

		// Update favicon link
		const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
		if (favicon) {
			favicon.href = url
		}

		// Cleanup
		return () => URL.revokeObjectURL(url)
	}, [Icon, iconSize])

	return (
		<div style={{ display: 'none' }} ref={iconRef}>
			{Icon && <Icon size={iconSize} />}
		</div>
	)
}

export default FaviconUpdater
