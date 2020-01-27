import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ItemCreateComponent } from './item-create/item-create.component';
import { ItemManageComponent } from './item-manage/item-manage.component';
import { ItemResolverService } from './services/item-resolver.service';
import { TreatmentCreateComponent } from './treatment-create/treatment-create.component';
import { TreeCreateComponent } from './tree-create/tree-create.component';
import { LabelCreateComponent } from './label-create/label-create.component';
import { TaxCreateComponent } from './tax-create/tax-create.component';
import { ScoreCreateComponent } from './score-create/score-create.component';
import { AuthGuard } from '../auth/auth.guard';
import { TreatmentService } from './services/treatment.service';
import { TreeManageComponent } from './tree-manage/tree-manage.component';
import { SubjectManageComponent } from './subject-manage/subject-manage.component';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';

const routes: Routes = [
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard], children: [
      { path: '', canActivateChild: [AuthGuard], component: AdminLandingComponent },
      { path: 'subjectManage', component: SubjectManageComponent },
      { path: 'itemCreate', canActivateChild: [AuthGuard], component: ItemCreateComponent },
      {
        path: 'itemManage', canActivateChild: [AuthGuard], component: ItemManageComponent, resolve: { items: ItemResolverService },
        children: [
          { path: 'baseEdit/:itemID', component: ItemCreateComponent, outlet: 'itemOutlet' }
        ]
      },
      {
        path: 'treatmentCreate',
        canActivateChild: [AuthGuard],
        resolve: {
          treatment: TreatmentService
        },
        component: TreatmentCreateComponent
      },
      {
        path: 'treatmentEdit/:id',
        canActivateChild: [AuthGuard],
        component: TreatmentCreateComponent,
        children: [
          {
            path: 'editItem/:itemID',
            canActivateChild: [AuthGuard],
            component: ItemCreateComponent,
            outlet: 'itemOutlet'
          },
          {
            path: 'editFilter/:treeID',
            canActivateChild: [AuthGuard],
            component: TreeCreateComponent,
            outlet: 'treeOutlet'
          }
        ]
      },
      {
        path: 'filterCreate', canActivateChild: [AuthGuard], component: TreeManageComponent, children: [
          { path: 'new', component: TreeCreateComponent, outlet: 'treeOutlet' },
          { path: 'edit/:treeID', component: TreeCreateComponent, outlet: 'treeOutlet' }
        ]
      },
      { path: 'labelCreate', canActivateChild: [AuthGuard], component: LabelCreateComponent },
      { path: 'taxCreate', canActivateChild: [AuthGuard], component: TaxCreateComponent },
      { path: 'scoreCreate', canActivateChild: [AuthGuard], component: ScoreCreateComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
