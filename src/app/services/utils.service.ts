import { Injectable, inject } from '@angular/core';
import { LoadingController, ModalController, ToastController, ModalOptions, ToastOptions } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);

  // ========== Loading =========
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  // ============ Toast =============
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // ============ Modal =============
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }
  dismissModal(data?: any){
    return this.modalCtrl.dismiss(data);
  }


  // ============ Evia a qualquer pagina disponivel =============
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // ============ Guarda um elemento no localstore  =============
  saveinLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // ============ Obtem um elemento no localstore  =============
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }


}
