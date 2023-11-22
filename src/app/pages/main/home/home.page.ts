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
        
    console.log("kkkkkkkkkk: "+JSON.stringify(resp))
      }
    })
  }  

  // ===== add e update de produto =====
  async addUpdateProduct(product?: Product){
    let success = this.utilSvc.presentModal({
      component: AddUdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    })
    if(success) this.getProdutos()
  }


  // ==== Confirmar Delete ====
  confirmDeleteInspection(product: Product){
    this.utilSvc.presentAlert({
      header: 'Deletar Produto',
      message: 'Desesa mesmo deletar?',
      buttons: [
        {text: 'Cancelar'},
        {
          text: 'Sim Deletar',
          handler: ()=>{
            this.deletarProduct(product);
          }
        }
      ]
    })
  }


   // ==== deletar Produto ====
   async deletarProduct(product: Product){
    
    let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilSvc.loading();
    await loading.present();

    // ====== deletar img ======
    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deletarFile(imagePath);

    this.firebaseSvc.deletarDocument(path)
    .then(async res => {
      this.utilSvc.presentToast({
        message: 'Produto Deletado existosament',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
       })

    })
    .catch(error => 
      this.utilSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
       })
    )
    .finally(()=>{
      loading.dismiss();
    })

}
 
}
