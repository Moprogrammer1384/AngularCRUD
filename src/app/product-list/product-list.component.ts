import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { SearchData } from '../models/search-data';
import { map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { producerAccessed } from '@angular/core/primitives/signals';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements AfterViewInit{

  products: MatTableDataSource<Product>;
  columnsToDisplay: string[];
  totalRecordCount: number = 0;
  defaultPageSize: number = 2;
  pageSizeOptions: number[] = [2, 3, 5, 10];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  searchText: FormControl;
  isFirstLoad: boolean = true;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private dialog: MatDialog) {

    this.products = new MatTableDataSource<Product>();

    this.columnsToDisplay = [
      'Id',
      'Name',
      'Price',
      'Actions'
    ];
    this.searchText = new FormControl('');
  }

  ngAfterViewInit(): void {
    this.loadProduct();

    this.paginator.page.subscribe(() => {
      this.loadProduct();
    });

    this.sort.sortChange.subscribe(() => {
      this.loadProduct();
    });
  }

  loadProduct() {
    let text = this.searchText.value;
    let pageSize = this.paginator.pageSize;
    let pageIndex = this.paginator.pageIndex + 1;
    let sortData = `${this.sort.active} ${this.sort.direction}`;
    let data = new SearchData(text, pageSize, pageIndex, sortData);

    this.productService.searchProducts(data).pipe(
      map((response: HttpResponse<Product[]>) => {
        this.totalRecordCount = parseInt(response.headers.get('x-totalrecordcount')!);
        return response.body as Product[];
      })
    ).subscribe({
      next: (products: Product[]) => {
        this.products = new MatTableDataSource<Product>(products);
        if(this.isFirstLoad){
          this.toastr.info('Loading Completed', 'Loading');
          this.isFirstLoad = false;
        }
      },
      error: (err: any) => {
        this.toastr.error('Loading Failed', 'Loading');
      }
    });
  }

  search() {
    this.loadProduct();
  }

  add() {
    this.dialog
              .open(AddProductComponent, {
                width: '60%'
              })
              .afterClosed()
              .subscribe((result: boolean) => {
                if(!result) return;

                this.loadProduct();
              });
  }

  edit(productId: number) {
    this.dialog
              .open(EditProductComponent, {
                width: '60%',
                data: productId
              })
              .afterClosed()
              .subscribe((result: boolean) => {
                if(!result) return;

                this.loadProduct();
              });
  }

  delete(productId: number) {
    this.dialog
              .open(ConfirmDeleteComponent, {
                width: '40%',
                data: `Are you sure you want to delete the product with productId (${productId})?`
              })
              .afterClosed()
              .subscribe((result: boolean) => {
                if(!result) return;

                this.productService
                .deleteProduct(productId)
                .subscribe({
                  next: (products: Product[]) => {
                    this.loadProduct();
                    this.toastr.success('Successfully deleted', 'Delete Product');
                  },
                  error: (err: any) => {
                    this.toastr.error('Delete Failed', 'Delete Product');
                  }
                });
              });
  }
}
