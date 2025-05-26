import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-browse',
  imports: [HeaderComponent, MatCard, MatIcon, MatChip],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
  standalone: true,
})
export class BrowseComponent {}
