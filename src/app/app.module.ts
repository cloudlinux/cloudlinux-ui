import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
    ClCoreModule,
    ClNavigationModule,
} from 'cloudlinux-ui';

import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { NEVER } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { Tab1Component } from './tab1/tab1.component';
import { Tab2Component } from './tab2/tab2.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent,
        Tab1Component,
        Tab2Component,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ClNavigationModule,
        ClCoreModule,
        MatDialogModule,
        AppRoutingModule,
    ],
    providers: [{
        provide: TranslateService,
        useValue: {
            onLangChange: NEVER,
        },
    }],
    bootstrap: [AppComponent],
})
export class AppModule {
}
