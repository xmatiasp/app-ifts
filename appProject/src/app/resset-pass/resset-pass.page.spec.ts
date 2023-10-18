import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RessetPassPage } from './resset-pass.page';

describe('RessetPassPage', () => {
  let component: RessetPassPage;
  let fixture: ComponentFixture<RessetPassPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RessetPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
