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
