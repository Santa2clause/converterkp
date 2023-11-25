import { Component, OnInit } from '@angular/core';
import { ConverterFormService } from './converter-form.service';
import { ExtendedOption, Option } from './converter-form.model';
import { NgIf, UpperCasePipe, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-converter-form',
  templateUrl: './converter-form.component.html',
  styleUrls: ['./converter-form.component.css'],
  imports: [FormsModule, NgIf, NgForOf, UpperCasePipe],
})
export class ConverterFormComponent implements OnInit {

  userInputValue: number = 0;
  result: number = 0;
  conversionErrorMessage!: string;
  fromOption: ExtendedOption | undefined;
  toOption: ExtendedOption | undefined;

  options: Option[] = [
    { value: 'length', label: 'Length' },
    { value: 'weight', label: 'Weight' },
    { value: 'temperature', label: 'Temperature' },
  ];

  selectedConversionType: string = this.options[0].value;
  firstDropdownOptions!: Option[];
  secondDropdownOptions!: Option[];
  selectedFirstDropdownOption!: string;
  selectedSecondDropdownOption!: string;

  constructor(private converterService: ConverterFormService) {}

  ngOnInit(): void {
    this.onConversionTypeChange();
  }

  onConversionTypeChange(): void {
    const options = this.converterService.getConversionOptions(this.selectedConversionType);
    this.firstDropdownOptions = options || [];
    this.secondDropdownOptions = options || [];
    this.selectedFirstDropdownOption = '';
    this.selectedSecondDropdownOption = '';
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

    this.conversionErrorMessage = '';

    const fromOption = this.getConversionOption(this.selectedFirstDropdownOption);
    const toOption = this.getConversionOption(this.selectedSecondDropdownOption);

    if (this.selectedConversionType === 'length') {
      this.result = this.converterService.convertLength(fromOption!, toOption!, this.userInputValue);
    } else if (this.selectedConversionType === 'weight') {
      this.result = this.converterService.convertWeight(fromOption!, toOption!, this.userInputValue);
    } else if (this.selectedConversionType === 'temperature') {
      this.result = this.converterService.convertTemperature(fromOption!, toOption!, this.userInputValue);
    }
  }

  private getConversionOption(value: string): ExtendedOption | undefined {
    const selectedConversionType = this.selectedConversionType;
  
    if (selectedConversionType) {
      const conversionOptions = this.converterService.getConversionOptions(selectedConversionType);
      return conversionOptions!.find(option => option.value === value);
    }
  
    return undefined;
  }
  
}
