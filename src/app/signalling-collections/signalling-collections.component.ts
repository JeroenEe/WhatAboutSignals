import {
	AfterViewInit,
	Component,
	signal,
	WritableSignal,
	computed,
	Signal,
	effect,
} from '@angular/core'

export type WritableSignalArray<T> = WritableSignal<WritableSignal<T>[]>

/**
 * A class that turns an array into an array of signals, then returns the array of signals as a signal.
 */
export class WriteableDeepSignal<T> {
	private _collection: WritableSignalArray<T> = signal([])

	get value() {
		return this._collection()
	}

	fromCollection(collection: T[]): WritableSignalArray<T> {
		this._collection.set(collection.map((item: T) => signal(item)))
		return this._collection
	}
}

@Component({
	standalone: true,
	selector: 'was-signalling-collections',
	imports: [],
	templateUrl: './signalling-collections.component.html',
	styleUrl: './signalling-collections.component.scss',
})
export class SignallingCollectionsComponent implements AfterViewInit {
	testArray = [1, 2, 3, 4]
	signalArray: WritableSignalArray<number>

	signalA: WritableSignal<number>
	signalB: WritableSignal<number>
	calculatedSumAB$: Signal<any>

	triggers = {
		signalA: 0,
		signalB: 0,
		signalArray: 0,
		calculatedSumAB: 0,
	}

	constructor() {
		this.signalArray = new WriteableDeepSignal<number>().fromCollection(this.testArray)

		this.signalA = this.signalArray()[0]
		this.signalB = this.signalArray()[1]
		this.calculatedSumAB$ = computed(() => {
			const result = this.signalA() + this.signalB()
			console.log(`Computed value is now: ${this.signalA()} + ${this.signalB()} = ${result}`)
			return result
		})

		effect(() => {
			const val = this.signalA
			console.log(`EFFECT Signal A changed to: ${this.signalA()}`)
			this.triggers.signalA++
		}),
			effect(() => {
				const val = this.signalB
				console.log(`EFFECT Signal B changed to: ${this.signalB()}`)
				this.triggers.signalB++
			}),
			effect(() => {
				const val = this.calculatedSumAB$
				console.log(`EFFECT Sum of A and B changed to: ${this.calculatedSumAB$()}`)
				this.triggers.calculatedSumAB++
			}),
			effect(() => {
				const val = this.signalArray
				console.log(`EFFECT Signal Array changed to: ${this.signalArray()}`)
				this.triggers.signalArray++
			})
	}

	ngAfterViewInit(): void {
		//this.goForever()
	}

	getRandomItemFromArray(): WritableSignal<number> {
		const randomIndex = Math.floor(Math.random() * this.signalArray().length)
		return this.signalArray()[randomIndex]
	}

	async goForever() {
		setTimeout(() => {
			const value = this.getRandomItemFromArray()
			value.update((oldvalue) => oldvalue + 1)
			this.goForever()
		}, 1000)
	}
}
