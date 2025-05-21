import { Routes } from '@angular/router'

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'change-detection',
	},
	{
		path: 'change-detection',
		pathMatch: 'full',
		loadComponent: () =>
			import('./change-detection/change-detection.component').then(
				(m) => m.ChangeDetectionComponent,
			),
	},
	{
		path: ' signalling-collections',
		pathMatch: 'full',
		loadComponent: () => import('./signalling-collections/signalling-collections.component').then(
			(m) => m.SignallingCollectionsComponent,
		),
	}
]
