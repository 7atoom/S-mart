import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChefPickPeople } from './ai-chef-pick-people';

describe('AiChefPickPeople', () => {
  let component: AiChefPickPeople;
  let fixture: ComponentFixture<AiChefPickPeople>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiChefPickPeople]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChefPickPeople);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
