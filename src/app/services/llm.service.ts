import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LlmService {
  private apiUrl = 'http://localhost:5000/query-llm';

  constructor(private http: HttpClient) { }

  queryLLM(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      prompt: prompt
    };

    return this.http.post(this.apiUrl, body, { headers: headers });
  }

  checkLLMConnection(): Observable<any> {
    const url = 'http://localhost:5000/check-llm';
    return this.http.get(url);
  }

}