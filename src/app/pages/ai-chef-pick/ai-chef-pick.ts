import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ai-chef-pick',
  imports: [],
  templateUrl: './ai-chef-pick.html',
  styleUrl: './ai-chef-pick.css',
})
export class AiChefPick implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  searchTerm: string = '';
  ngOnInit(): void {
    this.searchTerm = this.route.snapshot.paramMap.get('meal') || '';
  }
  goBack() {
    this.router.navigate(['aiChef']);
  }
  openSelectPeople(id: number) {
    this.router.navigate(['aiChef', this.searchTerm, id]);
  }
  recipes = [
    {
      id: 1,
      title: 'Grilled Ribeye with Herb Butter',
      description: 'Perfectly seared steak with a melting compound butter of fresh herbs.',
      time: '35 min',
      difficulty: 'Hard',
      difficultyLevel: 3,
    },
    {
      id: 2,
      title: 'Classic Pasta Carbonara',
      description: 'Creamy, silky carbonara with perfectly cooked pasta and crispy guanciale.',
      time: '25 min',
      difficulty: 'Medium',
      difficultyLevel: 2,
    },
    {
      id: 3,
      title: 'Fresh Caprese Salad',
      description: 'Simple, elegant salad with ripe tomatoes and creamy mozzarella.',
      time: '10 min',
      difficulty: 'Easy',
      difficultyLevel: 1,
    },
  ];
}
