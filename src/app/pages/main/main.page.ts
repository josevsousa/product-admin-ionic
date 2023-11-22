import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor() {
    console.log("ok")
   }

  ngOnInit() {
    console.log("to no main")
  }

}
