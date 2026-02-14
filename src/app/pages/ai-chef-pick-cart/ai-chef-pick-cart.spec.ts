import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChefPickCart } from './ai-chef-pick-cart';

describe('AiChefPickCart', () => {
  let component: AiChefPickCart;
  let fixture: ComponentFixture<AiChefPickCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiChefPickCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChefPickCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
