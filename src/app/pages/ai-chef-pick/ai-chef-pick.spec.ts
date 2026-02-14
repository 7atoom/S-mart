import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChefPick } from './ai-chef-pick';

describe('AiChefPick', () => {
  let component: AiChefPick;
  let fixture: ComponentFixture<AiChefPick>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiChefPick]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChefPick);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
