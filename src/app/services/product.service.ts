import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { SearchData } from '../models/search-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productServiceUrl: string = 'https://localhost:5001/product';
  constructor(private http: HttpClient) {

   }

  getProducts() : Product[] {
    return [
      new Product(1, 'Mobile', 100, 'Sample Mobile'),
      new Product(2, 'Tablet', 200, 'Sample Tablet'),
      new Product(3, 'Laptop', 300, 'Sample Laptop')
    ];
  }

  searchProducts(data: SearchData) : Observable<HttpResponse<Product[]>> {
    let endPointUrl = `${this.productServiceUrl}/search`;
    let queryParams = new HttpParams()
        .set('searchText', data.searchText)
        .set('pageSize', data.pageSize)
        .set('pageIndex', data.pageIndex)
        .set('sort', data.sort);


    return this.http.get<Product[]>(endPointUrl, {
      params: queryParams,
      observe: 'response'
    });
  }

  addProduct(product: Product): Observable<never> {
    return this.http.post<never>(this.productServiceUrl, product);
  }

  getProductById(productId: number): Observable<Product> {
    let endPointUrl = `${this.productServiceUrl}/${productId}`;

    return this.http.get<Product>(endPointUrl);
  }

  updateProduct(productId: number, product: Product): Observable<never> {
    let endPointUrl = `${this.productServiceUrl}/${productId}`;

    return this.http.put<never>(endPointUrl, product);
  }

  deleteProduct(productId: number): Observable<never> {
    let endPointUrl = `${this.productServiceUrl}/${productId}`;

    return this.http.delete<never>(endPointUrl);
  }
}
