import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { PartnerService, PartnerFilters } from '../services/partner.service';
import { Partner } from '../models/partner.model';
import { PartnerDetailComponent } from '../partner-detail/partner-detail.component';
import { PaginatedResponse } from '../../../shared/types/pagination.types';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Pagination {
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Component({
  selector: 'app-partner-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule
  ],
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss']
})
export class PartnerListComponent implements OnInit {
  partners: Partner[] = [];
  displayedColumns: string[] = ['alias', 'type', 'direction', 'application', 'processed_flow_type', 'actions'];
  loading: boolean = false;
  error: string | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  filterForm: FormGroup;
  sortBy = 'alias';
  sortOrder: 'ASC' | 'DESC' = 'ASC';
  pagination: Pagination = {
    total: 0,
    currentPage: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };

  constructor(
    private partnerService: PartnerService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      alias: [''],
      type: [''],
      direction: [''],
      processed_flow_type: ['']
    });
  }

  ngOnInit(): void {
    this.loadPartners();
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadPartners();
    });
  }

  loadPartners(): void {
    this.loading = true;
    this.error = null;

    const filters: PartnerFilters = {};
    const formValue = this.filterForm.value;
    if (formValue.alias) filters.alias = formValue.alias;
    if (formValue.type) filters.type = formValue.type;
    if (formValue.direction) filters.direction = formValue.direction;
    if (formValue.processed_flow_type) filters.processed_flow_type = formValue.processed_flow_type;

    this.partnerService.getPartners(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.sortOrder,
      filters
    ).subscribe({
      next: (response: PaginatedResponse<Partner>) => {
        this.partners = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des partenaires';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPartners();
  }

  openPartnerDialog(partner?: Partner): void {
    const dialogRef = this.dialog.open(PartnerDetailComponent, {
      width: '600px',
      data: { partner }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPartners();
      }
    });
  }

  deletePartner(partner: Partner): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      this.partnerService.deletePartner(partner.id).subscribe({
        next: () => {
          this.loadPartners();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du partenaire:', error);
        }
      });
    }
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortBy = column;
      this.sortOrder = 'ASC';
    }
    this.loadPartners();
  }
} 