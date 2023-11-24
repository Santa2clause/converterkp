import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ConverterFormComponent } from './converter-form.component';
import { of } from 'rxjs/internal/observable/of';

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

  it('should accept valid numeric input for userInput', () => {
    component.userInput = 10;
    expect(component.userInput).toBe(10);
  });

  it('should set the selectedConversionType property correctly', () => {
    component.selectedConversionType = 'length';
    expect(component.selectedConversionType).toBe('length');
  });

  it('should send the correct API request for length conversion', () => {
    spyOn(component.http, 'get').and.returnValue(of(10.5));
    component.selectedConversionType = 'length';
    component.selectedConversion = 'to-imperial';
    component.userInput = 10;
    component.convert();
    expect(component.http.get).toHaveBeenCalledWith('http://ec2-13-246-240-139.af-south-1.compute.amazonaws.com/converter/length-to-imperial/10');
  });

  it('should send the correct API request for weight conversion', () => {
    spyOn(component.http, 'get').and.returnValue(of(22.05));
    component.selectedConversionType = 'weight';
    component.selectedConversion = 'to-imperial';
    component.userInput = 10;
    component.convert();
    expect(component.http.get).toHaveBeenCalledWith('http://ec2-13-246-240-139.af-south-1.compute.amazonaws.com/converter/weight-to-imperial/10');
  });

  it('should update the result property with the converted value and unit', () => {
    spyOn(component.http, 'get').and.returnValue(of(10.5));
    component.selectedConversionType = 'length';
    component.selectedConversion = 'to-imperial';
    component.userInput = 10;
    component.convert();
    expect(component.result).toEqual({ value: 10.5, unit: 'feet' });
  });

  it('should log errors to the console', () => {
    const consoleSpy = spyOn(console, 'error');
    component.handleConversionError(new Error('Conversion error'));
    expect(consoleSpy).toHaveBeenCalledWith('Conversion error:', new Error('Conversion error'));
  });

});
