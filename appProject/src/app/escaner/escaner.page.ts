import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OcrService } from '../services/ocr.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import { TraductorService } from '../traductor.service';

@Component({
  selector: 'app-escaner',
  templateUrl: './escaner.page.html',
  styleUrls: ['./escaner.page.scss'],
})
export class EscanerPage implements OnInit {
  public scannedText?: string; //             este es la variable a usar
  public textoTraducido?: any; //             agregado**
  public mensajeTraducido:string//             agregado**
  public imageBase64: string="";
  public nombreArchivo: string="Sin seleccionar";
  public urlImagen?: string="../../assets/images/icono-imagenes.png";
  public seleccionado: boolean = false;
  public user;
  public guardado: boolean = true;

  constructor(public router: Router, private ocrService: OcrService,private loadingController: LoadingController,
    private alertController: AlertController,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    public traductor: TraductorService //             agregado**
    ) { }

  ngOnInit() {
    this.user = this.localStorageService.getFromLocalStorage('user');
  }
  
  //============== Uso de camara o galeria ==============
  async takePicture(){
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Eliga una opción',
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto'
    });
  }
  //============== Guardar datos de la imagen ==============
  async takeImage(){
    const dataUrl = ((await this.takePicture()).dataUrl);
    if(dataUrl){
      this.urlImagen = dataUrl;
      this.imageBase64 = dataUrl;
      this.nombreArchivo = "Imagen obtenida!"
      this.seleccionado = true;
    }
    
  }

  //============== Procesar imagen ya obtenida ==============
  async processImage() {

    const loading = await this.loadingController.create();
    await loading.present();

    if (this.imageBase64) {
      try {
        const data: any = await this.ocrService.performOCR(this.imageBase64).toPromise();
        this.scannedText = data.ParsedResults[0].ParsedText;

        //============== Llama a la Api del traductor ==============
        this.traductor.traducir(this.scannedText).subscribe(data => {
          var textoTraducido = data.text[0]
          this.mensajeTraducido = textoTraducido;

          console.log('solamente el texto a continuacion ::: '+textoTraducido); 
        });//finaliza Api traductor
        if(this.scannedText==""){
          throw new Error("No se pudo obtener texto de esta imagen");
        }
        this.guardado = false;
      } catch (error) {
        this.showAlert('Escaneo fallido: ', error.message+'. Por favor intene con otra.');
      }
    }
    await loading.dismiss();
  }
  //============== Alerta ==============
  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  //============== Guardar imagen ==============
  async guardarImagen(){
    const loading = await this.loadingController.create();
    await loading.present();

    let path = `users/${this.user.uid}/escaneos`;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.authService.uploadImage(imagePath, this.urlImagen);
    try{
      this.authService.addDocument(path, {imagen: imageUrl, texto: this.scannedText});
      this.showAlert('Todo salio bien', 'Se guardaron los datos con exito!');
      this.guardado = true;
    }
    catch (error){
      this.showAlert('Guardado fallido: ', error.message+'. Por favor intene otra vez mas tarde.');
    }

    await loading.dismiss();


  }
}
