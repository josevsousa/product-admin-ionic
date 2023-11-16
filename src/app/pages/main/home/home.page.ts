import { Component, OnInit, inject } from '@angular/core';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUdateProductComponent } from 'src/app/shared/components/add-udate-product/add-udate-product.component';
import { User } from 'src/app/models/user.models';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  products: Product[] = [];

  ngOnInit() {
    this.getProdutos()
  }

  // ===  quando entrar na pagina
  ionViewWillEnter(){
    this.getProdutos();
  }

  signOut(){
    this.firebaseSvc.logOut();
  }

  user(): User{
    return this.utilSvc.getFromLocalStorage('user');
  }

  // ==== obter produtos ===
  getProdutos(){
    let path = `users/${this.user().uid}/products`;
    let sub = this.firebaseSvc.getColletionData(path).subscribe({
      next: (resp: any)=>{
        this.products = resp;
      }
    })
  }  

  // ===== Agragar o actualizardor de produto =====
  addUpdateProduct(){
    this.utilSvc.presentModal({
      component: AddUdateProductComponent,
      cssClass: 'add-update-modal'
    })
  }
 
}
