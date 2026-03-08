import { Component } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';

@Component({
  selector: 'app-modules',
  imports: [ButtonComponent],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.scss',
})
export class ModulesComponent {
  readonly title = 'Modules';
  readonly modules = [
    {
      title: 'Basic JavaScript',
      text: 'The foundation of web development. Dive into syntax, basic data types, functions, arrays, objects, and DOM interaction basics.',
    },
    {
      title: 'Advanced JavaScript',
      text: 'Complex language concepts under the hood. In-depth analysis of execution context (this), closures, prototypal inheritance, and async.',
    },
    {
      title: 'Algorithms & Data Structures',
      text: 'Logical thinking training for algorithmic interview sections. Study data structures, evaluate algorithm time complexity (Big O).',
    },
    {
      title: 'TypeScript',
      text: 'The modern typing standard. Learn static types, interfaces, generics, and advanced language features to write reliable code.',
    },
  ] as const;
}
