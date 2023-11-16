import { Injectable, inject } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, } from 'firebase/auth';
import { User } from '../models/user.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, addDoc, getDoc, doc, collection } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);

  // =============== AUTH ================
  getAuth(){
    return getAuth();
  }

  // ====== Conectar ====
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }
  // ====== criar usuario ====
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }
  // ====== Atualizar usuario ====
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }
  // ====== Enviar email para restabelecer nova senha ====
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }
  // ====== Logolt ======
  logOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth')
  }


  // =============== BASE DE DADOS ================
  // ==== Setar um documento ====
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
  
  // ==== Obter um documento ====
  async getDocument(path: string) {
    return  (await getDoc(doc(getFirestore(), path))).data();
  }
  
  // ==== Agregar um documento ====
  addDocument(path: string, data: any) {
    return  addDoc(collection(getFirestore(), path),data);
  }


  // =============== upload de image ================
  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(()=>{
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  
}
