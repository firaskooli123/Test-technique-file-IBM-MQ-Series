import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message.model';
import { MessageDetailComponent } from '../message-detail/message-detail.component';
import { PartnerService } from '../../partners/services/partner.service';
import { Partner } from '../../partners/models/partner.model';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Message>;

  displayedColumns: string[] = ['id', 'content', 'partner', 'actions'];
  messages: Message[] = [];
  partners: Partner[] = [];
  isLoading = false;
  error: string | null = null;
  filterForm: FormGroup;
  pagination = {
    total: 0,
    currentPage: 1,
    limit: 10,
    totalPages: 0
  };

  // Mapping des colonnes du frontend vers le backend
  private columnMapping: { [key: string]: string } = {
    'id': 'id',
    'content': 'content',
    'partner': 'partner_id',
    'created_at': 'created_at',
    'updated_at': 'updated_at'
  };

  constructor(
    private messageService: MessageService,
    private partnerService: PartnerService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      partner_id: ['']
    });
  }

  ngOnInit(): void {
    this.loadPartners();
    this.loadMessages();
    this.filterForm.valueChanges.subscribe(() => {
      this.pagination.currentPage = 1;
      this.loadMessages();
    });
  }

  ngAfterViewInit() {
    // Configurer le tri initial
    this.sort.sort({
      id: 'created_at',
      start: 'desc',
      disableClear: false
    });

    // S'abonner aux changements de tri
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.pagination.currentPage = 1;
      this.loadMessages();
    });
  }

  loadPartners(): void {
    this.partnerService.getPartners(1, 1000).subscribe({
      next: (response) => {
        this.partners = response.data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des partenaires:', error);
      }
    });
  }

  loadMessages(): void {
    this.isLoading = true;
    this.error = null;
    const filters: any = {};
    if (this.filterForm.get('search')?.value) {
      filters.search = this.filterForm.get('search')?.value;
    }
    if (this.filterForm.get('partner_id')?.value) {
      filters.partner_id = this.filterForm.get('partner_id')?.value;
    }

    const sortDirection = this.sort?.direction ?  this.sort?.direction as 'asc' | 'desc' : "asc";
    const sortBy = this.sort?.active ? this.columnMapping[this.sort.active] : "id";

    this.messageService.getMessages(
      this.pagination.currentPage,
      this.pagination.limit,
      sortBy,
      sortDirection,
      filters
    ).subscribe({
      next: (response) => {
        this.messages = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des messages';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  onPageChange(event: any): void {
    this.pagination.currentPage = event.pageIndex + 1;
    this.pagination.limit = event.pageSize;
    this.loadMessages();
  }

  openMessageDialog(message?: Message): void {
    const dialogRef = this.dialog.open(MessageDetailComponent, {
      width: '600px',
      data: { message }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMessages();
      }
    });
  }

  deleteMessage(message: Message): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      this.messageService.deleteMessage(message.id).subscribe({
        next: () => {
          this.loadMessages();
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression du message';
          console.error('Erreur:', error);
        }
      });
    }
  }

  getPartnerAlias(id: number): string {
    const partner = this.partners.find(p => p.id === id);
    return partner ? partner.alias : '-';
  }
} 