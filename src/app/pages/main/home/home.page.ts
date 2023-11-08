import { Component, OnInit, inject } from '@angular/core';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUdateProductComponent } from 'src/app/shared/components/add-udate-product/add-udate-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);


  ngOnInit() {
  }

  signOut(){
    this.firebaseSvc.logOut();
  }

  // ===== Agragar o actualizardor de produto =====
  addUpdateProduct(){
    this.utilSvc.presentModal({
      component: AddUdateProductComponent,
      cssClass: 'add-update-modal'
    })
  }
 
}
