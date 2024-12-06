import { Component } from '@angular/core';
import { LlmService } from './services/llm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formData = {
    storeName: '',
    storeAddress: '',
    date: '',
    time: '',
    eventType: '',
    sku: 'N/A',
    totalItemValue: null,
    policeFile: 'N/A',
    policeOfficer: 'N/A',
    subjectIdentity: '',
    dob: '',
    subjectDescription: '',
    picturesOfItems: false,
    cctvImage: false,
    incidentReport: ''
  };

  report: string | null = null;

  llmStatus: string | null = null;

  constructor(private llmService: LlmService) {}

  ngOnInit(): void {
    this.checkLLMConnection();
  }

  checkLLMConnection() {
    this.llmService.checkLLMConnection().subscribe(
      (response) => {
        console.log("AI Connected");
        this.llmStatus = response.status === 'connected' ? 'LLM is connected' : 'LLM connection failed';
      },
      (error) => {
        this.llmStatus = 'LLM connection error: ' + error.message;
      }
    );
  }

  submitForm() {
    const prompt = `Store name & number: ${this.formData.storeName}, Store address: ${this.formData.storeAddress}, Date: ${this.formData.date}, Time: ${this.formData.time}, Event type: ${this.formData.eventType}, SKU #: ${this.formData.sku}, Total Item Value (Without Tax): ${this.formData.totalItemValue}, Police File #: ${this.formData.policeFile}, Police Officer: ${this.formData.policeOfficer}, Subject Identity: ${this.formData.subjectIdentity}, Subject full description: ${this.formData.subjectDescription}, Pictures of items taken: ${this.formData.picturesOfItems ? 'Yes' : 'No'}, CCTV image of Subject if available: ${this.formData.cctvImage ? 'Yes' : 'No'}, Incident Report: ${this.formData.incidentReport}`;
  
    // Send Incident Report to LLM
    this.llmService.queryLLM(prompt).subscribe(
      (response) => {
        const aiResponse = response.response;
      // Fit the AI-generated response into the desired format
      this.report = `Incident Report: ${aiResponse} `;
      },
      (error) => {
        this.report = 'Error generating the AI report: ' + error.message;
      }
    );
  }

}


