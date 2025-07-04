import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import CryptoJS from 'crypto-js'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function rabinKarpSearch(text: string, pattern: string): boolean {
	const prime: number = 101
	const textLength: number = text.length
	const patternLength: number = pattern.length
	const patternHash: number = hash(pattern)
	let textHash: number = hash(text.slice(0, patternLength))
	for (let i = 0; i <= textLength - patternLength; i++) {
		if (
			textHash === patternHash &&
			text.slice(i, i + patternLength) === pattern
		) {
			return true
		}
		textHash = rehash(text, textHash, i, patternLength, prime)
	}
	return false
}

function hash(str: string): number {
	let hashValue: number = 0
	const prime: number = 101
	for (let i = 0; i < str.length; i++) {
		hashValue += str.charCodeAt(i) * Math.pow(prime, i)
	}
	return hashValue
}

function rehash(
	text: string,
	prevHash: number,
	startIndex: number,
	patternLength: number,
	prime: number,
): number {
	const newHash: number = (prevHash - text.charCodeAt(startIndex)) / prime
	const newCharIndex: number = startIndex + patternLength
	const newHashValue: number =
		newHash + text.charCodeAt(newCharIndex) * Math.pow(prime, patternLength - 1)
	return newHashValue
}

export const encrypt = (value: string, secret_key: string) => {
	return CryptoJS.AES.encrypt(value, secret_key).toString()
}

export const decrypt = (cipherText: string, secret_key: string) => {
	try {
		const bytes = CryptoJS.AES.decrypt(cipherText, secret_key)
		return bytes.toString(CryptoJS.enc.Utf8)
	} catch (error) {
		console.error('Failed to decrypt value:', error)
		return null
	}
}

export function getPercentageOfCredits(
	total: number,
	remaining: number,
): number {
	return (remaining / total) * 100
}

export const getSubscriptionBadgeClasses = (type: string) => {
	switch (type) {
		case 'base':
			return 'bg-gray-300 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
		case 'pro':
			return 'bg-blue-300 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
		case 'business':
			return 'bg-purple-300 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300'
		default:
			return ''
	}
}
