import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { APIConstants } from './apiconstants';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  public IsUserLoggedIn: boolean = false;
  public baseurl: string = 'http://localhost:2000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  public Get(routePath: string) {
    return this.http.get<any>(this.baseurl + routePath, this.getHeader());

  }

  public Post(routePath: string, data: any) {
    return this.http.post<any>(this.baseurl + routePath, data, this.getHeader())
  }

  public GetAuth(routePath: string) {
    return this.http.get<any>(this.baseurl + routePath, this.getHeader(true));
  }

  public PostAuth(routePath: string, data: any) {
    var datav = this.http.post<any>(this.baseurl + routePath, data, this.getHeader(true))
    return datav;
  }

  public PutAuth(routePath: string, data: any) {
    return this.http.put<any>(this.baseurl + routePath, data, this.getHeader(true))
  }

  public Delete(routePath: string) {
    return this.http.delete<any>(this.baseurl + routePath, this.getHeader(true))
  }

  public Login(lModel: any) {
    const data = {
      username: lModel.username,
      password: lModel.password
    };
    var loginHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.baseurl + APIConstants.Login, data, { headers: loginHeader });
  }

  public Register(user: { name: string; username: string; password: string; status?: boolean }) {
    const data = {
      name: user.name,
      username: user.username,
      password: user.password,
      status: user.status ?? true,
    };
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.baseurl + APIConstants.CreateUser, data, { headers: header });
  }

  // POST /api/user/validate-token
  public validateToken() {
    return this.PostAuth(APIConstants.ValidateToken, {});
  }

  public Logout() {
    // Call logout API endpoint
    this.PostAuth(APIConstants.Logout, {}).subscribe({
      next: () => {
        // API call successful, proceed with cleanup
        this.performLogout();
      },
      error: () => {
        // Even if API fails, perform logout locally
        this.performLogout();
      }
    });
  }

  private performLogout() {
    this.IsUserLoggedIn = false;
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  public GetAuthToken() {
    const currentUser = this.GetLoggedInUser();
    return currentUser ?? null;
  }

  public GetLoggedInUser() {
    this.IsUserLoggedIn = false;
    try {
      const authDataString = localStorage.getItem('AuthData');
      if (!authDataString || authDataString === 'undefined' || authDataString === 'null') {
        return null;
      }
      var currentUser: any = JSON.parse(authDataString);

      if (currentUser !== null && Object.keys(currentUser).length > 0) {
        this.IsUserLoggedIn = true;
        return currentUser;
      }
      else {
        if (!this.IsUserLoggedIn) {
          this.Logout();
        }
        return null;
      }
    } catch (error) {
      console.error('Error parsing auth data from localStorage:', error);
      localStorage.removeItem('AuthData');
      this.IsUserLoggedIn = false;
      this.Logout();
      return null;
    }
  }



  private getHeader(isAuth: boolean = false) {
    var reqHeader: any;
    var token = this.GetAuthToken();
    if (isAuth) {
      reqHeader = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      );
    }
    else {
      reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return { headers: reqHeader };
  }

  // Product APIs
  getAllProducts() {
    return this.GetAuth(APIConstants.ProductGetAll);
  }

  getProductById(id: number | string) {
    return this.GetAuth(`${APIConstants.ProductGetById}/${id}`);
  }

  createProduct(product: { name: string; price: number; description?: string; status?: boolean }) {
    const data = {
      name: product.name,
      price: product.price,
      description: product.description ?? '',
      status: product.status ?? true,
    };
    return this.PostAuth(APIConstants.ProductCreate, data);
  }

  updateProduct(id: number | string, product: Partial<{ name: string; price: number; description: string; status: boolean }>) {
    return this.PutAuth(`${APIConstants.ProductUpdate}/${id}`, product);
  }

  deleteProduct(id: number | string) {
    return this.Delete(`${APIConstants.ProductDelete}/${id}`);
  }

  // Order APIs
  getAllOrders() {
    return this.GetAuth(APIConstants.OrderGetAll);
  }

  getOrderById(id: number | string) {
    return this.GetAuth(`${APIConstants.OrderGetById}/${id}`);
  }

  createOrder(order: { products: { product_id: number; quantity: number }[] }) {
    return this.PostAuth(APIConstants.OrderCreate, order);
  }

  updateOrder(id: number | string, order: any) {
    return this.PutAuth(`${APIConstants.OrderUpdate}/${id}`, order);
  }

  deleteOrder(id: number | string) {
    return this.Delete(`${APIConstants.OrderDelete}/${id}`);
  }

  // Weather API
  getCurrentWeather(city: string) {
    const query = `?city=${encodeURIComponent(city)}`;
    return this.Get(`${APIConstants.WeatherCurrent}${query}`);
  }

}