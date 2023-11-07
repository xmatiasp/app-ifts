import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface TraduccionResponse {
  text: string[];
}



@Injectable({
  providedIn: 'root'
})
export class TraductorService {

  constructor(
    public http: HttpClient
  ) {}


  traducir(texto: string) : Observable<TraduccionResponse>
  {
    const apiKey = 'trnsl.1.1.20231016T222718Z.43495ff65c1ff913.eb795e1366cf2f63d8825ef7d7db9b739bc5a4f5';
    //const texto = 'What do you do at work?';
    const lang = 'en-es';
    const apiUrl = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}&text=${texto}&lang=${lang}&format=plain&options=1`;

    return this.http.get<TraduccionResponse>(apiUrl);  
  }

}
