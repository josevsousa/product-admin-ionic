import { Component, OnInit , inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.models';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-udate-product',
  templateUrl: './add-udate-product.component.html',
  styleUrls: ['./add-udate-product.component.scss'],
})
export class AddUdateProductComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    solUnits: new FormControl('', [Validators.required, Validators.min(0)])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
  }

  //=========== Tirar/Selecionar Photo ==========
  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Image do produto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  async submit(){
    if (this.form.valid){

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
  }

}
