import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PartnerService } from '../services/partner.service';

@Component({
  selector: 'app-partner-form',
  templateUrl: './partner-form.component.html',
  styleUrls: ['./partner-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class PartnerFormComponent implements OnInit {
  partnerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private partnerService: PartnerService,
    public dialogRef: MatDialogRef<PartnerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.partnerForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      alias: ['', Validators.required],
      type: ['', Validators.required],
      direction: ['', Validators.required],
      application: [''],
      processed_flow_type: ['', Validators.required],
      description: ['', Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.partnerForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.partnerForm.valid) {
      const partner = this.partnerForm.value;
      if (this.data) {
        this.partnerService.updatePartner(this.data.id, partner).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating partner:', error);
          }
        });
      } else {
        this.partnerService.createPartner(partner).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating partner:', error);
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 