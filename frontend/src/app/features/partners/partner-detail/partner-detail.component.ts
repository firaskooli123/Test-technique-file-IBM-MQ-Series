import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PartnerService } from '../services/partner.service';
import { Partner } from '../models/partner.model';

@Component({
  selector: 'app-partner-detail',
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
  templateUrl: './partner-detail.component.html',
  styleUrls: ['./partner-detail.component.scss']
})
export class PartnerDetailComponent implements OnInit {
  partnerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private partnerService: PartnerService,
    public dialogRef: MatDialogRef<PartnerDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { partner?: Partner }
  ) {
    this.partnerForm = this.fb.group({
      alias: ['', Validators.required],
      type: ['', Validators.required],
      direction: ['', Validators.required],
      application: [''],
      processed_flow_type: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.partner) {
      this.partnerForm.patchValue(this.data.partner);
    }
  }

  onSubmit(): void {
    if (this.partnerForm.valid) {
      const partnerData = this.partnerForm.value;
      if (this.data.partner) {
        this.partnerService.updatePartner(this.data.partner.id, partnerData).subscribe({
          next: (partner) => {
            this.dialogRef.close(partner);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du partenaire:', error);
          }
        });
      } else {
        this.partnerService.createPartner(partnerData).subscribe({
          next: (partner) => {
            this.dialogRef.close(partner);
          },
          error: (error) => {
            console.error('Erreur lors de la création du partenaire:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 