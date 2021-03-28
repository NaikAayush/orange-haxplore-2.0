import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.css'],
})
export class ConsumerComponent implements OnInit {
  id;
  data;
  dataSource;
  displayedColumns;
  CHAIN_DATA = [];
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('cropId');
    console.log(this.id);
    this.data = await this.http
      .get<any>(environment.apiUrl + 'get/' + this.id)
      .toPromise();
    console.log(this.data);
    this.CHAIN_DATA = [
      { name: 'Producer Name', details: this.data.data.p_name },
      { name: 'Producer Location', details: this.data.data.p_loc },
      {
        name: 'Produced Date',
        details: this.data.data.p_date.substring(0, 10),
      },
      { name: 'Producer Weight', details: this.data.data.p_w },

      { name: 'Supplier Name', details: this.data.data.s_name },
      { name: 'Supplier Location', details: this.data.data.s_loc },
      {
        name: 'Supplier Dispatch Date',
        details: this.data.data.s_date.substring(0, 10),
      },
      { name: 'Supplier Weight', details: this.data.data.s_loc },
      { name: 'Supplier Storage Temperature', details: this.data.data.s_t },

      { name: 'Seller Name', details: this.data.data.se_name },
      { name: 'Seller Location', details: this.data.data.se_loc },
      {
        name: 'Seller Arrival Date',
        details: this.data.data.se_date.substring(0, 10),
      },
      { name: 'Seller Weight', details: this.data.data.se_w },
      { name: 'Seller Storage Temperature', details: this.data.data.se_t },
    ];
    this.displayedColumns = ['name', 'details'];
    this.dataSource = this.CHAIN_DATA;
  }
}
