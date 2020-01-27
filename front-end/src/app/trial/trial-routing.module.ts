import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrialComponent } from './trial.component';
import { FoodDetailsComponent } from './food-details/food-details.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { TrialConfigComponent } from './trial-config/trial-config.component';
import { TrialLandingComponent } from './trial-landing/trial-landing.component';
import { TrialShopComponent } from './trial-shop/trial-shop.component';
import { TrialTreatmentService } from './trial-services/trial-treatment.service';
import { StartTrialComponent } from './start-trial/start-trial.component';
import { Q1Component } from './q1/q1.component';
import { Q2Component } from './q2/q2.component';

const routes: Routes = [
  {
    path: 't/:treatmentID/s/:subjectID/shop',
    component: TrialComponent,
    resolve: { treatment: TrialTreatmentService },
    children: [
      { path: '', component: TrialLandingComponent },
      { path: 'cart', component: ShoppingCartComponent },
      { path: 'products', component: TrialShopComponent },
      { path: 'products/:id', component: FoodDetailsComponent },
    ]
  },
  { path: 't', component: TrialConfigComponent },
  { path: 't/:treatmentID', component: TrialConfigComponent },
  { path: 't/:treatmentID/s/:subjectID/start', component: StartTrialComponent },
  { path: 't/:treatmentID/s/:subjectID/q1', component: Q1Component },
  { path: 't/:treatmentID/s/:subjectID/q2', component: Q2Component },
  { path: 't/:treatmentID/s/:subjectID/end', loadChildren: './end-trial/end-trial.module#EndTrialModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrialRoutingModule { }
