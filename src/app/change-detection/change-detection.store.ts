import { computed, inject, InjectionToken, Injector } from '@angular/core'
import { getState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'

import { effect } from '@angular/core'
import { patchState, withHooks } from '@ngrx/signals'
import { v4 as uuid } from 'uuid'
import { faker } from '@faker-js/faker'
import { HttpClient } from '@angular/common/http'
import { catchError, delay, of, tap } from 'rxjs'

export type CDModel = {
	id: string
	surName: string
	firstName: string
	color: 'green' | 'red' | 'yellow' | 'blue'
	complexValue?: ComplexValue
}

export type ComplexValue = CDModel

export type BaseSignalState<T> = {
	data: T
	collectionData: T[]
	isLoading: boolean
	isRefreshing: boolean
    error: string | null
}

export type CDModelState = BaseSignalState<CDModel>

const CDMODEL_STATE = new InjectionToken<CDModelState>('CDModelState', {
	factory: () => initialState,
})

export const createCDModel = () => {
	return {
		id: uuid(),
		surName: faker.person.lastName(),
		firstName: faker.person.firstName(),
		color: getRandomValueFromArray(['blue', 'red', 'green', 'yellow']),
	} as CDModel
}

export const initialState = {
	data: createCDModel(),
	collectionData: [],
	isLoading: false,
	isRefreshing: false,
    error: null
}

export const createStateMethods = (store: any) => ({
	createNewCDModel(): void {
		patchState(store, {
			collectionData: [...store.collectionData(), createCDModel()],
		})
	},
	setCDModel(model?: CDModel): void {
		patchState(store, {
			data: model ?? createCDModel(),
		})
	},
	loadData(): void {
		patchState(store, { isLoading: true })
	},
})

export function getRandomValueFromArray(array: any[]): any {
	if (array.length === 0) {
		return null
	}
	const randomIndex = Math.floor(Math.random() * array.length)
	return array[randomIndex]
}

// export const createStateEffects = (store: any) => () => {
// 	effect(() => {
// 		const data = store.data()
// 		console.log('I was fired because data changed', data)
// 	})

//     effect(() => {
//         const collectionData = store.collectionData()
//         console.log('I was fired because collectionData changed', collectionData)
//     })

// 	effect(() => {
// 		const loading = store.isLoading()
// 		console.log('I was fired because loading changed', loading)
// 	})

// 	effect(() => {
// 		const refreshing = store.isRefreshing()
// 		console.log('I was fired because refreshing changed', refreshing)
// 	})
// }

export const CDModelStore = signalStore(
	withState(() => inject(CDMODEL_STATE)),
	withMethods((store) => createStateMethods(store)),
	withComputed((store) => ({
		fullName: computed(() => store.data().firstName ? `${store.data().firstName} ${store.data().surName}` : ''),
	})),
	withHooks({
		onInit(store) {
			// Get injector in proper context
			const injector = inject(Injector)
			const http = inject(HttpClient)

			effect(() => {
				const data = store.data()
				console.log('I was fired because data changed to', data)
			})

			effect(() => {
				const loading = store.isLoading()

				if (loading) {
					const action = getRandomValueFromArray(['success', 'error'])
					let request

                    patchState(store, { data: {} as CDModel, error: null})

					if (action === 'success') {
						request = http
							.get<CDModel>('/api/success')
							.pipe(catchError((x) => of(createCDModel())))
							.pipe(
								delay(1000),
								tap(() => patchState(store, { isLoading: false })),
							)
					} else {
						request = http.get<CDModel>('/api/error')
					}

					request.subscribe({
						next: (x) => {
							store.setCDModel(x)
							patchState(store, { isLoading: false })
						},
						error: (error) => {
							patchState(store, { error: error.message, isLoading: false })
						},
					})
				}
				console.log('I was fired because loading changed to', loading)
			})

			effect(() => {
				const refreshing = store.isRefreshing()
				console.log('I was fired because refreshing changed to', refreshing)
			})
		},
	}),
)
