export class MicroPhone {
	private mediaRecorder: MediaRecorder | null = null
	private mediaStream: MediaStream | null = null
	public timeSlice: number = 1000
	public echoCancellation: boolean = false
	public noiseSuppression: boolean = false
	public audioGainControl: boolean = false
	public onStop?: () => void
	public isRecoding: boolean = false
	public record: boolean = false
	private chunks: Blob[] | null = null

	constructor(options?: {
		timeSlice?: number
		echoCancellation?: boolean
		noiseSuppression?: boolean
		audioGainControl?: boolean
		record?: boolean
		onStop?: () => void
	}) {
		if (options && options.timeSlice) {
			this.timeSlice = options.timeSlice
			this.echoCancellation = options.echoCancellation ?? false
			this.noiseSuppression = options.noiseSuppression ?? false
			this.audioGainControl = options.audioGainControl ?? false
			this.record = options.record ?? false
			this.onStop = options.onStop
		}
	}
	public startRecoding() {
		this.isRecoding = true
		navigator.mediaDevices
			.getUserMedia({
				audio: {
					echoCancellation: this.echoCancellation,
					noiseSuppression: this.noiseSuppression,
					autoGainControl: this.audioGainControl,
				},
			})
			.then(stream => {
				this.mediaStream = stream
				this.mediaRecorder = new MediaRecorder(stream)
				if (this.record) {
					this.mediaRecorder.addEventListener('dataavailable', event => {
						if (!this.chunks) {
							this.chunks = [event.data]
						} else {
							this.chunks.push(event.data)
						}
					})
				}
			})
			.catch(err => console.log('Error While Accessing MicroPhone', err))
	}

	public onBlob(callback?: (data: BlobEvent) => void) {
		if (!this.mediaRecorder) {
			console.log('MediaRecorder is not initialized yet.')
			return
		}

		this.mediaRecorder.addEventListener('dataavailable', event => {
			if (callback) {
				callback(event)
			}
		})

		this.mediaRecorder.start(this.timeSlice)
		console.log('Recording started')
	}

	public stopRecording() {
		this.isRecoding = false
		if (this.mediaRecorder && this.mediaStream) {
			if (this.onStop) {
				this.onStop()
			}
			this.mediaStream.getTracks().forEach(track => track.stop())
			this.mediaRecorder.stop()
			console.log('Recording stopped')
		}
	}
}
