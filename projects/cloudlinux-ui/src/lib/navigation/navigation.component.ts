import {
    AfterViewInit,
    Component,
    ContentChildren, Directive,
    ElementRef,
    HostBinding,
    OnDestroy,
    QueryList,
    SkipSelf,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { fromEvent, timer, Subject } from 'rxjs';
import { debounceTime, merge, takeUntil } from 'rxjs/operators';
import { IntervalService } from '../core/interval.service';
import { ConnectedPosition, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { animate, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { ClTemplateDirective } from '../core/template.directive';

/**
 * We can not pass all required parameters to
 * mat-menu/matMenuTriggerBy
 */
@Directive({
    selector: '[clNavigationDropdownOverlay]',
    providers: [{
        provide: Overlay,
        useClass: NavigationDropDownOverlayDirective,
    }],
})
export class NavigationDropDownOverlayDirective {
    constructor (@SkipSelf() private overlay: Overlay) {}
    position() {
        return this.overlay.position() as any;
    }
    create(config: OverlayConfig) {
        if (config.positionStrategy) {
            let connectedPositions: ConnectedPosition[];
            Object.defineProperty(config.positionStrategy, '_preferredPositions', {
                get: () => connectedPositions,
                set(newPositions: ConnectedPosition[]) {
                    connectedPositions = newPositions;
                    for (const pos of newPositions) {
                        pos.offsetY = 55;
                    }
                },
            });
        }
        return this.overlay.create(config) as any;
    }
}

@Component({
    selector: 'cl-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('navClosed', [
            // angular animations can not use media queries but can animate transition
            // css animations can use media queries but can not animate transitions...
            transition('* => *', [animate(600)]),
        ]),
    ],
})
export class NavigationComponent implements AfterViewInit, OnDestroy {
    @ViewChild('separator') separator: ElementRef;
    @HostBinding('attr.role') readonly role = 'navigation';
    @ContentChildren(ClTemplateDirective, {descendants: true})
    set templates(templates: QueryList<ClTemplateDirective>) {
        this.leftTemplates.length = 0;
        this.rightTemplates.length = 0;
        this.buttonTemplates.length = 0;
        this.dropTemplates.length = 0;
        this.logoTemplate = undefined;
        templates.forEach(template => {
            switch (template.name) {
                case 'button':
                    this.buttonTemplates.push(template.template);
                    break;
                case 'right':
                    this.rightTemplates.push(template.template);
                    break;
                case 'logo':
                    this.logoTemplate = template.template;
                    break;
                default:
                    this.leftTemplates.push(template.template);
                    break;
            }
        });
        this.forceNormalize.next();
    }
    @HostBinding('class.cl-nav-closed') @HostBinding('@navClosed') closed: boolean = true;
    leftTemplates: Array<TemplateRef<any>> = [];
    rightTemplates: Array<TemplateRef<any>> = [];
    buttonTemplates: Array<TemplateRef<any>> = [];
    dropTemplates: Array<TemplateRef<any>> = [];
    logoTemplate?: TemplateRef<any>;
    destroyed = new Subject;
    forceNormalize = new Subject;
    constructor(private elementRef: ElementRef,
                private translateService: TranslateService,
                private interval: IntervalService) {}

    addToMain() {
        if (this.dropTemplates.length) {
            let template = this.dropTemplates.shift();
            if (template) {
                this.leftTemplates.push(template);
            }
            return true;
        }
    }

    addToDrop() {
        if (this.leftTemplates.length) {
            let template = this.leftTemplates.pop();
            if (template) {
                this.dropTemplates.unshift(template);
            }
            return true;
        }
    }
    ngOnDestroy() {
        this.destroyed.next();
    }

    ngAfterViewInit() {
        let width: number;
        fromEvent(window, 'resize')
            .pipe(
                merge(this.forceNormalize),
                merge(this.interval.interval10),
                merge(this.translateService.onLangChange),
                debounceTime(400),
                takeUntil(this.destroyed),
            ).subscribe(async () => {
                if (width !== this.getSeparatorWidth()) {
                    await this.normalize();
                    await timer().toPromise(); // wait for change detection
                    width = this.getSeparatorWidth();
                }
        });
    }
    async normalize() {
        let changed;
        do {
            changed = false;
            if (window.innerWidth < 768) {
                changed = this.addToMain();
            } else if (!this.isMainNavHeightOk()) {
                changed = this.addToDrop();
                await timer().toPromise(); // wait for change detection
            } else {
                changed = this.addToMain();
                await timer().toPromise(); // wait for change detection
                if (!this.isMainNavHeightOk()) {
                    this.addToDrop();
                    return;
                }
            }
        } while (changed);
    }
    private getSeparatorWidth() {
        return this.separator.nativeElement.offsetWidth;
    }
    private isMainNavHeightOk() {
        return this.elementRef.nativeElement.offsetHeight <= 60;
    }
}
