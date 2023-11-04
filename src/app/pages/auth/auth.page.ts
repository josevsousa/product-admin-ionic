import { Component, OnInit , inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.models';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  //  submit(){
  //   if (this.form.valid){
  //     this.firebaseSvc.sigIn(this.form.value as User).then( res => {
  //       console.log(res)
  //     })
  //   }
  // }
  async submit(){
    if (this.form.valid){
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User)
      .then( res => {
        console.log(res)
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
