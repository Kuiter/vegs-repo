import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrialRoutingModule } from './trial-routing.module';
import { TrialComponent } from './trial.component';
import { FoodCardComponent } from './food-card/food-card.component';
import { FoodDetailsComponent } from './food-details/food-details.component';
import { ItemGridComponent } from './item-grid/item-grid.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ProductService } from './trial-services/product.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { FilterComponent } from './filter/filter.component';
import { SubjectSelectComponent } from './subject-select/subject-select.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TreatmentSelectComponent } from './treatment-select/treatment-select.component';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';
import { TrialConfigComponent } from './trial-config/trial-config.component';
// import { HeaderComponent } from '../shared/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { FilterService } from './trial-services/filter.service';
import { TrialLandingComponent } from './trial-landing/trial-landing.component';
import { TrialShopComponent } from './trial-shop/trial-shop.component';
import { TrialTreatmentService } from './trial-services/trial-treatment.service';
import { ShoppingMetricsComponent } from './shopping-metrics/shopping-metrics.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { SwapDialogComponent } from './swap-dialog/swap-dialog.component';
import { StartTrialComponent } from './start-trial/start-trial.component';
import { ScoreDirective } from './food-card/score.directive';
import { FixedNavDirective } from './trial-shop/fixed-nav.directive';
import { Q1Component } from './q1/q1.component';
import { Q2Component } from './q2/q2.component';
import { SwapOptDialogComponent } from './swap-opt-dialog/swap-opt-dialog.component';
import { AlternateBgColorDirective } from './alternate-bg-color.directive';


@NgModule({
  declarations: [
    TrialComponent,
    FoodCardComponent,
    FoodDetailsComponent,
    ItemGridComponent,
    ShoppingCartComponent,
    FilterComponent,
    SubjectSelectComponent,
    TreatmentSelectComponent,
    TrialConfigComponent,
    TrialLandingComponent,
    TrialShopComponent,
    ShoppingMetricsComponent,
    InfoDialogComponent,
    SwapDialogComponent,
    StartTrialComponent,
    ScoreDirective,
    FixedNavDirective,
    Q1Component,
    Q2Component,
    SwapOptDialogComponent,
    AlternateBgColorDirective,
  ],
  imports: [
    CommonModule,
    TrialRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatTreeModule,
    MatExpansionModule,
    MatStepperModule,
    MatRadioModule,
    MatSliderModule,
    MatBadgeModule,
    MatToolbarModule
  ],
  providers: [
    ProductService,
    ShoppingCartService,
    FilterService,
    TrialTreatmentService,
  ],
  entryComponents: [InfoDialogComponent, SwapDialogComponent, SwapOptDialogComponent]
})
export class TrialModule { }
