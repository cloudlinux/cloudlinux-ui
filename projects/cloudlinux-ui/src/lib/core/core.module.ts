import { NgModule } from '@angular/core';
import { ClTemplateDirective } from './template.directive';
import { intervalServiceProvider } from './interval.service';

const publicDirectives = [
    ClTemplateDirective,
];

@NgModule({
    declarations: [
        ...publicDirectives,
    ],
    exports: [
        ...publicDirectives,
    ],
    providers: [
        intervalServiceProvider,
    ],
})
export class ClCoreModule {}
