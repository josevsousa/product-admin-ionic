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

  ngOnInit() {
  }

  async submit(){
    if (this.form.valid){
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User)
      .then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name);
        let uid = res.user.uid;
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
