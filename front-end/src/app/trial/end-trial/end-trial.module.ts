import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndTrialComponent } from './end-trial.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: EndTrialComponent }
]

@NgModule({
  declarations: [EndTrialComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EndTrialModule { }
