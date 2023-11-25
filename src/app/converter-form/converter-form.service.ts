import { Injectable } from '@angular/core';
import { ExtendedOption } from './converter-form.model';

@Injectable({
  providedIn: 'root',
})
export class ConverterFormService {

  convertLength(fromOption: ExtendedOption, toOption: ExtendedOption, userInput: number): number {
    return (userInput * (toOption!.factor || 1)) / (fromOption!.factor || 1);
  }

  convertWeight(fromOption: ExtendedOption, toOption: ExtendedOption, userInput: number): number {
    return (userInput * (toOption!.factor || 1)) / (fromOption!.factor || 1);
  }

  convertTemperature(fromOption: ExtendedOption, toOption: ExtendedOption, userInput: number): number {
    return (userInput - (fromOption!.offset || 0)) * (fromOption!.factor || 1) / (toOption!.factor || 1) + (toOption!.offset || 0);
  }

  getConversionOptions(type: string): ExtendedOption[] | undefined {
    return this.conversionOptions[type];
  }

  constructor() {}

  private conversionOptions: { [key: string]: ExtendedOption[] } = {
    length: [
      { value: 'meters', label: 'Meters', factor: 1 },
      { value: 'inches', label: 'Inches', factor: 39.3701 },
      { value: 'centimeters', label: 'Centimeters', factor: 100 },
    ],
    weight: [
      { value: 'kilograms', label: 'Kilograms', factor: 1 },
      { value: 'pounds', label: 'Pounds', factor: 2.20462 },
      { value: 'grams', label: 'Grams', factor: 1000 },
    ],
    temperature: [
      { value: 'celsius', label: 'Celsius', factor: 1 },
      { value: 'fahrenheit', label: 'Fahrenheit', factor: 1.8, offset: 32 },
      { value: 'kelvin', label: 'Kelvin', factor: 1, offset: 273.15 },
    ],
  };
}
