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
  CHAIN_DATA = [{ name: 'Producer Name', details: 'AK' }];
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
  }
  displayedColumns: string[] = ['name', 'details'];
  dataSource = this.CHAIN_DATA;
}
