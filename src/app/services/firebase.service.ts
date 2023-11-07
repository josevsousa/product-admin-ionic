import { Injectable, inject } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, getDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);

  // =============== AUTH ================
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


  // =============== BASE DE DADOS ================
  // ==== Setar um documento ====
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
  // ==== Obter um documento ====
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }


}
