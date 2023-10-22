import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OcrService } from '../services/ocr.service';

@Component({
  selector: 'app-escaner',
  templateUrl: './escaner.page.html',
  styleUrls: ['./escaner.page.scss'],
})
export class EscanerPage implements OnInit {
  public scannedText?: string;
  public imageBase64?: string;
  public nombreArchivo: string="Sin seleccionar";
  public urlImagen?: string="../../assets/images/icono-imagenes.png";

  constructor(public router: Router, private ocrService: OcrService) { }

  ngOnInit() {

  }
  
  uploadImage(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imageBase64 = reader.result as string;
    };

    reader.readAsDataURL(file);
    this.nombreArchivo = file.name;
    this.urlImagen = URL.createObjectURL(file);
  }

  processImage() {
    if (this.imageBase64) {
      this.ocrService.performOCR(this.imageBase64).subscribe(
        (data: any) => {
          console.log(data);
          this.scannedText = data.ParsedResults[0].ParsedText;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  returnHome(){
    this.router.navigate(['home']);
  }

}
