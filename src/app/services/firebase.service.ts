import { Injectable, inject } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);

  // ===== Autenticaction ======

  // ====== acessar ====
  sigIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password) 
  }

}
