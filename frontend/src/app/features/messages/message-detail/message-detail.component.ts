import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '../services/message.service';
import { PartnerService } from '../../partners/services/partner.service';
import { Message } from '../models/message.model';
import { Partner } from '../../partners/models/partner.model';

@Component({
  selector: 'app-message-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnInit {
  messageForm: FormGroup;
  partners: Partner[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private partnerService: PartnerService,
    public dialogRef: MatDialogRef<MessageDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message?: Message }
  ) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required],
      partner_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPartners();
    if (this.data.message) {
      this.messageForm.patchValue(this.data.message);
    }
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

  onSubmit(): void {
    if (this.messageForm.valid) {
      const messageData = this.messageForm.value;
      if (this.data.message) {
        this.messageService.updateMessage(this.data.message.id, messageData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du message:', error);
          }
        });
      } else {
        this.messageService.createMessage(messageData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Erreur lors de la création du message:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 