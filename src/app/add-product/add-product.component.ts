import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  productForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddProductComponent>,
    private productService: ProductService,
    private toastr: ToastrService) {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      price: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      description: new FormControl('')
    });
  }

  save() {

    if(this.productForm.invalid) return;
    const product = this.productForm.value as  Product;

    this.productService.addProduct(product).subscribe({
      next: () => {
        this.toastr.success('Successfully saved', 'Save');
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        this.toastr.error('Save Failed', 'Save');
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  // Accessor
  get name(): FormControl {
      return this.productForm.get('name') as FormControl;
  }

  get price(): FormControl {
    return this.productForm.get('price') as FormControl;
  }



}
