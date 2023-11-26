import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ConverterFormComponent } from './converter-form.component';

describe('ConverterFormComponent', () => {
  let component: ConverterFormComponent;
  let fixture: ComponentFixture<ConverterFormComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConverterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error message when "Convert From" and "Convert To" options are not selected', () => {
    component.convert();
    expect(component.conversionErrorMessage).toEqual("Please select both 'Convert From' and 'Convert To' options.");
  });

  it('should display an error message when userInputValue is negative for length and weight conversions', () => {
    component.selectedConversionType = 'length';
    component.selectedFirstDropdownOption = 'Meters';
    component.selectedSecondDropdownOption = 'Centimeters';
    component.userInputValue = -10;
    component.convert();
    expect(component.conversionErrorMessage).toEqual('Please enter a non-negative value for length and weight conversions.');
  });

  it('should display an error message when userInputValue is below absolute zero for temperature conversions', () => {
    component.selectedConversionType = 'temperature';
    component.selectedFirstDropdownOption = 'Celsius';
    component.selectedSecondDropdownOption = 'Fahrenheit';
    component.userInputValue = -275;
    component.convert();
    expect(component.conversionErrorMessage).toEqual('Temperature below absolute zero is not allowed.');
  });
  
  it('should reset the form on reset() method call', () => {
    component.selectedConversionType = 'Length';
    component.selectedFirstDropdownOption = 'Meters';
    component.selectedSecondDropdownOption = 'Centimeters';
    component.userInputValue = 1.75;
    
    component.reset();

    expect(component.selectedConversionType).toBe('Length');
    expect(component.selectedFirstDropdownOption).toBe('');
    expect(component.selectedSecondDropdownOption).toBe('');
    expect(component.userInputValue).toBe(0);
  });

});
