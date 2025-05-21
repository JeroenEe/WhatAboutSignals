import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing'

import { SignallingCollectionsComponent } from './signalling-collections.component'
import { computed } from '@angular/core'

fdescribe('SignallingCollectionsComponent', () => {
	let component: SignallingCollectionsComponent
	let fixture: ComponentFixture<SignallingCollectionsComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SignallingCollectionsComponent],
		}).compileComponents()

		fixture = TestBed.createComponent(SignallingCollectionsComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

it('should update computedSum and run effects each time signals change', async () => {
  component.signalA.set(2)
  component.signalB.set(3)
  await Promise.resolve()
  expect(component.calculatedSumAB$()).toBe(5)

  component.signalA.set(3)
  component.signalB.set(4)
  await Promise.resolve()
  expect(component.calculatedSumAB$()).toBe(7)

  console.log('Triggers fired:', component.triggers)
})
})
