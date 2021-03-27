import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public url: string = '';
  agent: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.url = this.router.url;
    var name = this.url.split('/', 2);
    console.log(name);
    if (name[1] == 'producer') {
      this.agent = 'Producer Login';
    } else if (name[1] == 'supplier') {
      this.agent = 'Supplier Login';
    } else if (name[1] == 'seller') {
      this.agent = 'Seller Login';
    }

    console.log(this.router.url);
  }
}
