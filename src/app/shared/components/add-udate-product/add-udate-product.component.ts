import { Component, OnInit ,Input, inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.models';
import { UtilsService } from 'src/app/services/utils.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-add-udate-product',
  templateUrl: './add-udate-product.component.html',
  styleUrls: ['./add-udate-product.component.scss'],
})
export class AddUdateProductComponent  implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    solUnits: new FormControl(null, [Validators.required, Validators.min(0)])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  titlePag: string = "Add Produto";

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if(this.product) this.form.setValue(this.product);
  }

  //=========== Tirar/Selecionar Photo ==========
  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Image do produto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit(){
    if (this.form.valid){
      if(this.product) this.updateProduct();
      else this.creatProduct();
    }
  }

  // ==== Criar Produto ====
  async creatProduct(){

      let path = `users/${this.user.uid}/products`;

      const loading = await this.utilsSvc.loading();
      await loading.present();


      // === Suber imagem e obter a url ====
      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id;

      this.firebaseSvc.addDocument(path, this.form.value)
      .then(async res => {
        this.utilsSvc.dismissModal({ success: true});
        this.utilsSvc.presentToast({
          message: 'Produto criado existosament',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
         })

      })
      .catch(error => 
        this.utilsSvc.presentToast({
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

  // ==== atualizar Produto ====
  async updateProduct(){
    
      let path = `users/${this.user.uid}/products/${this.product.id}`;

      const loading = await this.utilsSvc.loading();
      await loading.present();


      // === Subir imagem, atualizar e obter a url ====
     if(this.form.value.image !== this.product.image){
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
     }

      delete this.form.value.id;

      this.firebaseSvc.updateDocument(path, this.form.value)
      .then(async res => {
        this.utilsSvc.dismissModal({ success: true});
        this.utilsSvc.presentToast({
          message: 'Produto Atualizado existosament',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
         })

      })
      .catch(error => 
        this.utilsSvc.presentToast({
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
