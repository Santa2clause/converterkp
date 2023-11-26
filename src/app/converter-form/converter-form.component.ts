import { Component, OnInit } from '@angular/core';
import { ConverterFormService } from './converter-form.service';
import { ExtendedOption, Option } from './converter-form.model';
import { NgIf, UpperCasePipe, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-converter-form',
  templateUrl: './converter-form.component.html',
  styleUrls: ['./converter-form.component.css'],
  imports: [FormsModule, NgIf, NgForOf, UpperCasePipe],
})

export class ConverterFormComponent implements OnInit {

  userInputValue: number = 0;
  result!: number | null;
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

  constructor(
    private converterService: ConverterFormService, 
    public http: HttpClient
  ) {}

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
  }

  reset() {
    this.selectedFirstDropdownOption = "";
    this.selectedSecondDropdownOption = "";
    this.userInputValue = 0;
    this.result = 0;
    this.conversionErrorMessage = "";
  }
  
  convert(): void {
    if (!this.selectedFirstDropdownOption || !this.selectedSecondDropdownOption) {
      this.conversionErrorMessage = "Please select both 'Convert From' and 'Convert To' options.";
      return;
    }
  
    this.conversionErrorMessage = '';
  
    const fromOption = this.getConversionOption(this.selectedFirstDropdownOption);
    const toOption = this.getConversionOption(this.selectedSecondDropdownOption);
  
    if ((this.selectedConversionType === 'length' || this.selectedConversionType === 'weight') && this.userInputValue < 0) {
      this.conversionErrorMessage = "Please enter a non-negative value for length and weight conversions.";
      return;
    }
  
    if (this.selectedConversionType === 'temperature' && this.userInputValue < -273.15) {
      this.conversionErrorMessage = "Temperature below absolute zero is not allowed.";
      return;
    }
  
    const conversionType = this.selectedConversionType.charAt(0).toUpperCase() + this.selectedConversionType.slice(1).toLowerCase();

    this.converterService.convertUnit(fromOption!, toOption!, this.userInputValue, conversionType, this.http).subscribe(
      result => {
        if (result !== null) {
          this.result = result;
        } else {
          this.conversionErrorMessage = `Oops! Something went wrong during the ${this.selectedConversionType} conversion.`;
        }
      },
      error => {
        console.error(`Error in ${this.selectedConversionType} conversion:`, error);
        this.conversionErrorMessage = `Oops! Something went wrong during the ${this.selectedConversionType} conversion.`;
      }
    );
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
