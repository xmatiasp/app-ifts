import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscaneosPage } from './escaneos.page';

describe('EscaneosPage', () => {
  let component: EscaneosPage;
  let fixture: ComponentFixture<EscaneosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EscaneosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
