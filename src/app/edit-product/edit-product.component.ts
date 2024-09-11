import { AfterViewInit, Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements AfterViewInit {
  productForm: FormGroup;
  isLoading: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public productId: number,
    private productService: ProductService,
    private toastr: ToastrService) {
    this.productForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      price: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      description: new FormControl('')
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadProduct();
    }, 1000)
  }

  save() {

    if(this.productForm.invalid) return;
    const product = this.productForm.value as  Product;

    this.productService.updateProduct(this.productId, product).subscribe({
      next: (value: any) => {
        this.toastr.success('Successfully updated', 'Update Product');
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        this.toastr.error('Update Failed', 'Update Product');
      }
    });
  }

  loadProduct(){
    this.productService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.productForm.setValue(product);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.toastr.error('Loading Product Data Failed', 'Loading');
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
