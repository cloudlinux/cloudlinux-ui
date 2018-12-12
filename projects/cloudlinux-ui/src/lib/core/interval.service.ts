import { FactoryProvider, Optional, SkipSelf } from '@angular/core';
import { share, startWith } from 'rxjs/operators';
import { interval, Observable } from 'rxjs';

export class IntervalService {
    interval10: Observable<number> = interval(10000)
        .pipe(
            share(), // make all subscriptions synchronous
            startWith(null),
        );
}

export const intervalServiceFactory = (parent?: IntervalService) => {
    if (parent) {
        return parent;
    }
    return new IntervalService();
};

export const intervalServiceProvider: FactoryProvider = {
    provide: IntervalService,
    useFactory: intervalServiceFactory,
    deps: [[new Optional, new SkipSelf,  IntervalService]],
};
