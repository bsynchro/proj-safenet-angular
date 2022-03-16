import { Injectable } from '@angular/core';
import { EventPayload } from '@bsynchro/services';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { filter } from 'rxjs/operators';

@Injectable()
export class BroadcastService {

    public broadcastSubject = new Subject<EventPayload>();

    public on(eventType: string): Observable<EventPayload> {
        return this.broadcastSubject.pipe(filter(event => event.eventType === eventType));
    }

    public broadcast(event: EventPayload): void {
        this.broadcastSubject.next(event);
    }
}