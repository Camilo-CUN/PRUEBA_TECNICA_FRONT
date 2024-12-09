import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Products } from '../interfaces/products.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

constructor() { }
private http = inject(HttpClient)
private loadingSignal = signal<boolean>(false);
public loading = computed(() => this.loadingSignal())
private apiurl: string = environment.apiUrl;


getAllProducts(): Observable<Products[]>{
  return this.http.get<Products[]>(`${this.apiurl}/Product/GetAllproducts`);
}

deleteProductById(id: number): Observable<void> {
  const url = `${this.apiurl}/Product/DeleteProductById/${id}`;
  return this.http.delete<void>(url);
}

updateProduct(product: Products): Observable<Products> {
  const url = `${this.apiurl}/Product/UpdateProduct/${product.id}`;
  return this.http.put<Products>(url, product);
}

createProduct(product: Products): Observable<Products> {
  const url = `${this.apiurl}/Product/CreateProduct`;
  return this.http.post<Products>(url, product);
}


onLoading(value: boolean){
  this.loadingSignal.set(value)
}


}
