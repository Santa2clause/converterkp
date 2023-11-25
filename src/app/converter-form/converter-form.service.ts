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
    switch (toOption.value) {
      case 'Fahrenheit':
        return (userInput - (fromOption!.offset || 0)) * (fromOption!.factor || 1) / (toOption!.factor || 1) + (toOption!.offset || 0);
      case 'Kelvin':
        return (userInput - (fromOption!.offset || 0)) * (fromOption!.factor || 1) + (toOption!.offset || 0) + 273.15;
      default:
        throw new Error('Invalid conversion unit');
    }
  }

  getConversionOptions(type: string): ExtendedOption[] | undefined {
    return this.conversionOptions[type];
  }

  constructor() {}

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
        { value: 'Celsius', label: 'Celsius', factor: 1 },
        { value: 'Fahrenheit', label: 'Fahrenheit', factor: 1.8, offset: 32 }, 
        { value: 'Kelvin', label: 'Kelvin', factor: 1, offset: 273.15 },
    ],
  };
}
