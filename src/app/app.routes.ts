import { Routes } from '@angular/router'

export const routes: Routes = [
	{
		path: 'change-detection',
		loadChildren: () =>
			import('./change-detection/change-detection.component').then(
				(m) => m.ChangeDetectionComponent,
			),
	},
]
