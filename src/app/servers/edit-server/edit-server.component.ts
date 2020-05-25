import {Component, OnInit} from '@angular/core';

import {ServersService} from '../servers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CanComponentDeactivate} from './can-deactivate-guard.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: { id: number, name: string, status: string };
  serverName = '';
  serverStatus = '';
  allowEdit = false;
  changesSaved = false;

  constructor(private serversService: ServersService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    console.log(this.route.queryParams.subscribe());
    console.log(this.route.fragment.subscribe());
    const id = +this.route.snapshot.params['id'];
    this.route.queryParams
      .subscribe((queryParams: Params) => {
        this.allowEdit = +queryParams['allowEdit'] === 1;
      });
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.server.id = +queryParams['id'];
    });
    this.server = this.serversService.getServer(id);
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowEdit) {
      return true;
    }

    if ((this.server.name !== this.serverName || this.serverStatus !== this.server.status) && !this.changesSaved) {
      return confirm('Do you want to discard the canges ? ');
    } else {
      return true;
    }
  }

}
