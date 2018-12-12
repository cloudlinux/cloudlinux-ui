import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    selector: '[clTemplate],cl-temp',
})
export class ClTemplateDirective {
    @Input() set clTemplate(val) {
        this.name = val;
    }
    name: string;
    constructor(public template: TemplateRef<any>) {}
}
