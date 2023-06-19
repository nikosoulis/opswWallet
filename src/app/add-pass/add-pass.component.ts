import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { File } from "@awesome-cordova-plugins/file/ngx";
import { Zip } from "@awesome-cordova-plugins/zip/ngx";
import { NavController } from "@ionic/angular";
import { OpswPass } from "../model/pass.interface";
import { PassStorage } from "../service/pass-storage.service";

@Component({
    selector: "app-new-pass",
    templateUrl: "add-pass.component.html",
    styleUrls: ["add-pass.component.scss"]
})
export class AddPassComponent implements OnInit {
    @ViewChild("passTitle") passTitle!: ElementRef;
    @ViewChild("passFile") passFile!: ElementRef;
    fileData: any = undefined;
    private _newPassForm = this.formBuilder.group({
        pass_title: [null, [Validators.required]],
    });

    constructor(
        private navCtrl: NavController,
        private formBuilder: FormBuilder,
        private file: File,
        private zip: Zip,
        private passStorage: PassStorage
    ) {

    }

    ngOnInit(): void {

    }

    navigateHome() {
        this.navCtrl.pop();
    }

    private getDirectoryName(passTitle: string) {
        let result = "";
        if(passTitle && passTitle.length > 0) {
            result = passTitle.replaceAll(" ", "_")
        }
        return result;
    }

    onFileSelected(ev: any) {
        this.fileData = ev.target.files[0];
        // console.log("THis is file selected event ", selectedFile);
        // console.log("This is the directory name ", this.getDirectoryName(this._newPassForm.controls.pass_title.value != null ? this._newPassForm.controls.pass_title.value : ""));
        //this.writeCustomFile("", "uniwa_pkpass.pkpass", selectedFile);
    }

    onAddFile() {
        this.passFile.nativeElement.click();
    }

    writeCustomFile(directoryName: string, filename: string, data: any) {
        return this.file.writeFile(this.file.dataDirectory, filename, data, { replace: true, append: false })
            .then(createdFile => {
                console.log('File written successfully.');
                console.log(createdFile)
            })
            .catch(err => {
                console.error(err);
            });
    }

    async onFormSubmit() {
        
        if(this._newPassForm.valid) {
            try {
                await this.onSavePass();
            } catch(error) {
                console.log("An Error Occured :", error);
            }
            
        }

    }

    onSavePass() {
        return new Promise(async (resolve, reject) => {
            try {
                const dirName = this._newPassForm.controls.pass_title.value != null ? this._newPassForm.controls.pass_title.value: "";
                const directoryResult = await this.file.createDir(this.file.dataDirectory, this.getDirectoryName(dirName), true);
                console.log("This is result from Directory Creation ", directoryResult);
                if(!this.fileData) {
                    throw "Pkpass file does not selected!!";
                }
                const fileResult = await this.file.writeFile(directoryResult.nativeURL, "data.pkpass", this.fileData, {replace: true});
                console.log("this is result of file creation ", fileResult);
                const unzipResult = await this.zip.unzip(fileResult.nativeURL, directoryResult.nativeURL,
                    () => {
                        console.log("On Unzip process event....");
                    }    
                );
                console.log("This is unzip result ", unzipResult);
                const dirEntries = await this.file.listDir(this.file.dataDirectory, directoryResult.name);
                console.log("This is dir content ", dirEntries);
                const readFileResult = await this.file.readAsText(directoryResult.nativeURL, "pass.json")
                const jsonOb = JSON.parse(readFileResult);
                console.log("This is content of pass.json ", jsonOb);
                const thumbBase64 = await this.file.readAsDataURL(directoryResult.nativeURL, "thumbnail.png");
                const logoBase64 = await this.file.readAsDataURL(directoryResult.nativeURL, "logo.png");
                const resultData: OpswPass = {
                    id: "",
                    origData: jsonOb,
                    extraData: {
                        logoPath: logoBase64,
                        thumbPath:  thumbBase64
                    },
                    dataPath: directoryResult.nativeURL
                };
                await this.passStorage.addPass(resultData);
                // const imageResult = await this.file.readAsText(directoryResult.nativeURL, "thumbnail.png");
                // console.log("This is image str ", imageResult);

            } catch(error) {
                reject(error);
            }
            
        });
    }

    

    ionViewDidEnter() {
        console.log(this.passTitle);
        this.passTitle.nativeElement.focus();
    }

    get newPassForm() {
        return this._newPassForm;
    }
}