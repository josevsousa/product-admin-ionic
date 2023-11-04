import { Injectable, inject } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);

  // ===== Autenticaction ======


  // ====== Conectar ====
  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password) 
  }

  // ====== criar usuario ====
  signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password) 
  }

  // ====== Atualizar usuario ====
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, { displayName })
  }


}
