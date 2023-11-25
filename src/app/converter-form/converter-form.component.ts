import { HttpClient } from '@angular/common/http';
import {Component} from '@angular/core';
import {NgIf, UpperCasePipe, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

interface ConversionResult {
  value: number;
  unit: string;
}

interface Option {
  value: string;
  label: string;
}

interface ConversionOptions {
  [key: string]: ExtendedOption[];
}

export interface ExtendedOption extends Option {
  factor?: number;
  offset?: number;
}

@Component({
  standalone: true,
  selector: 'app-converter-form',
  templateUrl: './converter-form.component.html',
  styleUrls: ['./converter-form.component.css'],
  imports: [FormsModule, NgIf, NgForOf, UpperCasePipe],
})

export class ConverterFormComponent {

  userInputValue: number = 0;
  result: number = 0;
  conversionErrorMessage!: string;
  fromOption: ExtendedOption | undefined;
  toOption: ExtendedOption | undefined;

  options: Option[] = [
    { value: "length", label: "Length" },
    { value: "weight", label: "Weight" },
    { value: "temperature", label: "Temperature" },
  ];

  conversionOptions: ConversionOptions = {
    length: [
      { value: "meters", label: "Meters", factor: 1 },
      { value: "inches", label: "Inches", factor: 39.3701 },
      { value: "centimeters", label: "Centimeters", factor: 100 },
    ],
    weight: [
      { value: "kilograms", label: "Kilograms", factor: 1 },
      { value: "pounds", label: "Pounds", factor: 2.20462 },
      { value: "grams", label: "Grams", factor: 1000 },
    ],
    temperature: [
      { value: "celsius", label: "Celsius", factor: 1 },
      { value: "fahrenheit", label: "Fahrenheit", factor: 1.8, offset: 32 },
      { value: "kelvin", label: "Kelvin", factor: 1, offset: 273.15 },
    ],
  };

  selectedConversionType: string = this.options[0].value;
  firstDropdownOptions!: Option[];
  secondDropdownOptions!: Option[];
  selectedFirstDropdownOption!: string;
  selectedSecondDropdownOption!: string;

  constructor() {
    this.userInputValue = 0;
  }

  ngOnInit(): void {
    this.onConversionTypeChange();
  }

  onConversionTypeChange(): void {
    this.firstDropdownOptions = this.conversionOptions[this.selectedConversionType];
    this.secondDropdownOptions = this.conversionOptions[this.selectedConversionType];;
    this.selectedFirstDropdownOption = "";
    this.selectedSecondDropdownOption = "";
  }

  onUserInputChanged(): void {
    const stringValue = String(this.userInputValue).replace(/,/g, '.');
    this.userInputValue = parseFloat(stringValue);

    // Log the converted value
    console.log('Converted value:', this.userInputValue);
  }

  convert(): void {

    if (!this.selectedFirstDropdownOption || !this.selectedSecondDropdownOption) {
      this.conversionErrorMessage = "Please select both 'Convert From' and 'Convert To' options.";
      return;
    }

    this.conversionErrorMessage = "";

    if (this.selectedConversionType === 'length') {
      this.result = this.convertLength();
    } else if (this.selectedConversionType === 'weight') {
      this.result = this.convertWeight();
    } else if (this.selectedConversionType === 'temperature') {
      this.result = this.convertTemperature();
    }
    
  }

  private convertLength(): number {
    const fromOption = this.getConversionOption(this.selectedFirstDropdownOption);
    const toOption = this.getConversionOption(this.selectedSecondDropdownOption);
    return (this.userInputValue * (toOption!.factor || 1)) / (fromOption!.factor || 1);
  }
  
  private convertWeight(): number {
    const fromOption = this.getConversionOption(this.selectedFirstDropdownOption);
    const toOption = this.getConversionOption(this.selectedSecondDropdownOption);
    return (this.userInputValue * (toOption!.factor || 1)) / (fromOption!.factor || 1);
  }
  
  private convertTemperature(): number {
    const fromOption = this.getConversionOption(this.selectedFirstDropdownOption);
    const toOption = this.getConversionOption(this.selectedSecondDropdownOption);
    return (this.userInputValue - (fromOption!.offset || 0)) * (fromOption!.factor || 1) / (toOption!.factor || 1) + (toOption!.offset || 0);
  }
  
  private getConversionOption(value: string): ExtendedOption | undefined {
    return this.conversionOptions[this.selectedConversionType].find(option => option.value === value);
  }
}
