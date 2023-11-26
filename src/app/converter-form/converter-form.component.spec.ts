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
