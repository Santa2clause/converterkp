import { HttpClient } from '@angular/common/http';
import {Component} from '@angular/core';
import {NgIf, UpperCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

interface ConversionResult {
  value: number;
  unit: string;
}

@Component({
  standalone: true,
  selector: 'app-converter-form',
  templateUrl: './converter-form.component.html',
  styleUrls: ['./converter-form.component.css'],
  imports: [FormsModule, NgIf, UpperCasePipe],
})

export class ConverterFormComponent {
  userInput: number = 0;
  selectedConversionType: string = 'length';
  selectedConversion: string = '';
  result: ConversionResult = { value: 0, unit: '' };

  constructor(public http: HttpClient) {}

  convert() {
    const apiUrl = 'http://ec2-13-246-240-139.af-south-1.compute.amazonaws.com/converter';

    switch (this.selectedConversionType) {
      case 'length':
        this.convertLength(apiUrl);
        break;
      case 'weight':
        this.convertWeight(apiUrl);
        break;
      case 'temperature':
        this.convertTemperature(apiUrl);
        break;
      default:
        break;
    }
  }

  public convertLength(apiUrl: string) {
    if (this.selectedConversion === 'to-imperial' || this.selectedConversion === 'to-metric') {
      this.http.get<number>(`${apiUrl}/length-${this.selectedConversion}/${this.userInput}`)
        .subscribe({
          next: (response) => this.handleConversionResponse(response, ['feet', 'meters']),
          error: (error) => this.handleConversionError(error),
        });
    }
  }

  public convertWeight(apiUrl: string) {
    if (this.selectedConversion === 'to-imperial' || this.selectedConversion === 'to-metric') {
      this.http.get<number>(`${apiUrl}/weight-${this.selectedConversion}/${this.userInput}`)
        .subscribe({
          next: (response) => this.handleConversionResponse(response, ['pounds', 'kilograms']),
          error: (error) => this.handleConversionError(error),
        });
    }
  }

  public convertTemperature(apiUrl: string) {
    if (this.selectedConversion === 'to-imperial' || this.selectedConversion === 'to-metric') {
      this.http.get<number>(`${apiUrl}/temperature-${this.selectedConversion}/${this.userInput}`)
        .subscribe({
          next: (response) => this.handleConversionResponse(response, ['Fahrenheit', 'Celsius']),
          error: (error) => this.handleConversionError(error),
        });
    }
  }

  public handleConversionResponse(response: number, units: [string, string]) {
    this.result = {
      value: +response.toFixed(2),
      unit: this.selectedConversion === 'to-imperial' ? units[0] : units[1],
    };
  }

  public handleConversionError(error: any) {
    console.error('Conversion error:', error);
  }
}
