import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExtendedOption } from './converter-form.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ConverterFormService {

  constructor() {}

  //private apiUrlBase = 'http://localhost:80/converter';
  private apiUrlBase = 'http://ec2-13-245-231-58.af-south-1.compute.amazonaws.com/converter';

  private createFormData(fromOption: ExtendedOption, toOption: ExtendedOption, userInput: number): FormData {
    const formData = new FormData();
    formData.append('fromUnit', fromOption.value);
    formData.append('toUnit', toOption.value);
    formData.append('userInput', userInput.toString());
    return formData;
  }

  private createHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return headers;
  }

  private handleError(error: any): Observable<null> {
    if (error.status === 0) {
      console.error('Network error:', error);
    } else if (error.status === 401) {
      console.error('Unauthorized error:', error);
    } else if (error.status === 403) {
      console.error('Forbidden error:', error);
    } else {
      console.error('Unexpected error:', error);
    }
    return of(null);
  }

  private makeApiCall(http: HttpClient, apiUrl: string, formData: FormData, headers: HttpHeaders): Observable<number | null> {
    return http.post<number>(apiUrl, formData, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  convertUnit(
    fromOption: ExtendedOption,
    toOption: ExtendedOption,
    userInput: number,
    unitType: string,
    http: HttpClient
  ): Observable<number | null> {
    const headers = this.createHeaders();
    const formData = this.createFormData(fromOption, toOption, userInput);
    const apiUrl = `${this.apiUrlBase}/${unitType.toLowerCase()}`;
    return this.makeApiCall(http, apiUrl, formData, headers);
  }
  
  getConversionOptions(type: string): ExtendedOption[] | undefined {
    return this.conversionOptions[type];
  }

  private conversionOptions: { [key: string]: ExtendedOption[] } = {
    length: [
      { value: 'Meters', label: 'Meters', factor: 1 },
      { value: 'Inches', label: 'Inches', factor: 39.3701 },
      { value: 'Centimeters', label: 'Centimeters', factor: 100 },
    ],
    weight: [
      { value: 'Kilograms', label: 'Kilograms', factor: 1 },
      { value: 'Pounds', label: 'Pounds', factor: 2.20462 },
      { value: 'Grams', label: 'Grams', factor: 1000 },
    ],
    temperature: [
        { value: 'Celsius', label: 'Celsius', factor: 5/9, offset: 0 },
        { value: 'Fahrenheit', label: 'Fahrenheit', factor: 9/5, offset: 32 }, 
        { value: 'Kelvin', label: 'Kelvin', factor: 5/9, offset: 273.15 },
    ],
  };
}