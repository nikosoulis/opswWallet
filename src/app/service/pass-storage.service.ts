import { EventEmitter, Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { OpswPass } from "../model/pass.interface";
import * as uuid from "uuid";

@Injectable({
    providedIn: "root"
})
export class PassStorage {

    private _canReload: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(
        private storageServ: StorageService
    ) {

    }

    private getAllPasses() {
        return this.storageServ.getValue("passes");
    }

    async getPassesArray() {
        let result: OpswPass[] = [];
        try {
            const dataStr = await this.getAllPasses();
            result = JSON.parse(dataStr);
        } catch(error) {
            throw error;
        }
        return result;
    }

    async addPass(current: OpswPass) {
        try {
            const allDataStr = await this.getAllPasses();
            let allData: OpswPass[];
            if(allDataStr) {
                allData = JSON.parse(allDataStr);
            } else {
                allData = [];
            }
            if(current.id === "") {
                current.id = uuid.v4();
            }
            allData.push(current);
            await this.storageServ.setValue("passes", JSON.stringify(allData));
            this._canReload.emit(true);
        } catch(error) {
            throw "An Error Occured when save pass instorage!!!";
        }
    }

    get canReload() {
        return this._canReload;
    }


}