import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private apiKey = 'K85123983388957';

  constructor(private http: HttpClient) { }

  performOCR(imageBase64: string) {
    const headers = new HttpHeaders({
      'apiKey': this.apiKey
    });

    const formData = new FormData();
    formData.append('language', 'spa');
    formData.append('OCREngine', '2');
    formData.append('base64Image', imageBase64);
    const textoEscaneado = this.http.post('https://api.ocr.space/parse/image', formData, { headers });
    if(textoEscaneado){
      return textoEscaneado;
    }else{
      return null;
    }
  }
}
