import { NgModule } from '@angular/core';
import {
    NavigationComponent,
    NavigationDropDownOverlayDirective,
} from './navigation.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ClCoreModule } from '../core/core.module';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        ClCoreModule,
    ],
    declarations: [
        NavigationComponent,
        NavigationDropDownOverlayDirective,
    ],
    exports: [
        NavigationComponent,
        NavigationDropDownOverlayDirective,
    ],
})
export class ClNavigationModule {}
