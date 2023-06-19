import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Zip} from "@awesome-cordova-plugins/zip/ngx";
import {File} from "@awesome-cordova-plugins/file/ngx";
import {Chooser} from "@awesome-cordova-plugins/chooser/ngx";
import { Subscription } from 'rxjs';
import { PassStorage } from '../service/pass-storage.service';
import { OpswPass } from '../model/pass.interface';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public folder!: string;
  private _allPasses: OpswPass[] | undefined;
  private activatedRoute = inject(ActivatedRoute);


  @ViewChild("filepicker") uploader!: ElementRef;
  private _$canReloadSub: Subscription | undefined;
  constructor(
    private router: Router,
    private passStorage: PassStorage
  ) {}
  ngOnDestroy(): void {
    if(this._$canReloadSub) {
      this._$canReloadSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.passStorage.getPassesArray().then((passes) => {
      this._allPasses = passes;
    });
    this._$canReloadSub = this.passStorage.canReload.subscribe(
      {
        next: async (val: boolean) => {
          if(val) {
            try {
              this._allPasses = await this.passStorage.getPassesArray();
            } catch(error) {
              console.log("An Error Occured on reload passes from storage. ", error);
            }
            
          }
        },
        error: (error: any) => {
          console.log("An error Occured!!! ", error);
        },
      }
    );

  }
  onAddNewPass() {
    this.router.navigate(["/", "new-pass"]);
  }

  changeView() {

  }

  get allPasses() {
    return this._allPasses;
  }

  getLabelColor(pass: OpswPass) {
    return {
      color: pass.origData.labelColor
    };  

  }

  cardStyle(pass: OpswPass) {
    return {
      "--backgroud": pass.origData.backgroudColor
    };
  }


}
