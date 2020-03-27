import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameEvent } from './../models';

import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameEventsService {
  private _baseUrl = 'assets/events-mock.json';
  constructor(private _http: HttpClient) {}

  getGameEvents(): Observable<GameEvent[]> {
    return this._http.get<GameEvent[]>(this._baseUrl)
      .pipe(
        delay(300),  // to mimic the delay of response time
        map(data => data.sort((a, b) => a.time < b.time ? -1 : 1))
      );
  }
}
