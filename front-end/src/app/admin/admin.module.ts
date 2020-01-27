import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { ItemCreateComponent } from './item-create/item-create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ItemManageComponent } from './item-manage/item-manage.component';
import { ItemResolverService } from './services/item-resolver.service';
import { ItemService } from './services/item.service';
import { ImageDialogComponent } from '../shared/image-dialog/image-dialog.component';
import { TreatmentCreateComponent } from './treatment-create/treatment-create.component';
import { TreeCreateComponent } from './tree-create/tree-create.component';
import { TreeService } from './services/tree.service';
import { ItemAllocateDialogComponent } from './item-allocate-dialog/item-allocate-dialog.component';
import { LabelCreateComponent } from './label-create/label-create.component';
import { TaxCreateComponent } from './tax-create/tax-create.component';
import { ScoreCreateComponent } from './score-create/score-create.component';
import { TreatmentService } from './services/treatment.service';
import { TreeManageComponent } from './tree-manage/tree-manage.component';
import { FilterAllocateDialogComponent } from './filter-allocate-dialog/filter-allocate-dialog.component';
import { LabelAllocateDialogComponent } from './label-allocate-dialog/label-allocate-dialog.component';
import { SubjectManageComponent } from './subject-manage/subject-manage.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';

@NgModule({
  declarations: [
    AdminComponent, 
    ItemCreateComponent, 
    ItemManageComponent, 
    TreatmentCreateComponent, 
    TreeCreateComponent, 
    ItemAllocateDialogComponent, 
    LabelCreateComponent, 
    TaxCreateComponent, 
    ScoreCreateComponent, TreeManageComponent, FilterAllocateDialogComponent, LabelAllocateDialogComponent, SubjectManageComponent, AdminHeaderComponent, AdminLandingComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatTreeModule,
    MatDialogModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatToolbarModule,
    MatDividerModule,
    MatChipsModule,
    MatPaginatorModule,
  ],
  providers:[
    ItemResolverService,
    ItemService,
    TreeService,
    TreatmentService,
  ],
  entryComponents: [
    ImageDialogComponent, 
    ItemAllocateDialogComponent, 
    FilterAllocateDialogComponent,
    LabelAllocateDialogComponent,
  ]
})
export class AdminModule { }
