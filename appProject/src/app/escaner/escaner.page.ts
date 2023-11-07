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
  //============== Texto escaneado ==============
  public scannedText?: string; //             
  public textoTraducido?: any; //             traductor
  public mensajeTraducido:string//             traductor
  //============== string que se enviara al servicio de OCR ==============
  public imageBase64: string="";
  //Inicialmente era el nombre del archivo pero con el uso de camara no se podia obtener el nombre
  //Se termino usando como una condicion para mostrar texto en rojo o el boton de procesar imagen
  public nombreArchivo: string="Sin seleccionar";
  //============== url para mostrar imagen en html ==============
  public urlImagen?: string="../../assets/images/icono-imagenes.png";
  //============== Condicion para mostrar si la imagen ya se selecciono ==============
  public seleccionado: boolean = false;
  public user;
  //============== Condicion para saber si ya se guardo el escaneo ==============
  public guardado: boolean = true;

  constructor(public router: Router, private ocrService: OcrService,private loadingController: LoadingController,
    private alertController: AlertController,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    public traductor: TraductorService
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
    this.urlImagen = "../../assets/images/icono-imagenes.png";
    this.seleccionado = false;
    this.scannedText = '';
    try{
      const dataUrl = ((await this.takePicture()).dataUrl);
        this.urlImagen = dataUrl;
        this.imageBase64 = dataUrl;
        this.nombreArchivo = "Imagen obtenida!"
        this.seleccionado = true;
    }
    catch (error){
      this.showAlert("Error","Ocurrio un error al tomar la foto");
    }
  }

  //============== Procesar imagen ya obtenida ==============
  async processImage() {

    const loading = await this.loadingController.create();
    await loading.present();

    if (this.imageBase64) {
      try {
        await this.ocrService.performOCR(this.imageBase64).toPromise().then(
          (res: any)=>{
            this.scannedText = res.ParsedResults[0].ParsedText;

        //============== Llama a la Api del traductor ==============
          this.traductor.traducir(this.scannedText).subscribe(data => {
            var textoTraducido = data.text[0]
            this.mensajeTraducido = textoTraducido;
          
          });//finaliza Api traductor
        }
        ).catch(error=>{
          throw new Error("El archivo supera el tamaño máximo permitido (1024KB)");
        });
        if(this.scannedText==""){
          throw new Error("No se pudo obtener texto de esta imagen");
        }
        this.guardado = false;
      } catch (error) {
        this.showAlert('Escaneo fallido: ', error.message +'. Por favor, intene con otra.');
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
      this.authService.addDocument(path, {imagen: imageUrl, texto: this.scannedText, fecha: new Date().toLocaleString()});
      this.showAlert('Todo salió bien', 'Se guardó el escaneo con éxito!');
      this.guardado = true;
    }
    catch (error){
      this.showAlert('Guardado fallido: ', error.message+'. Por favor, intene otra vez más tarde.');
    }

    await loading.dismiss();
  }
}
