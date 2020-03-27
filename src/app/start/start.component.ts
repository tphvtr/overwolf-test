import { GameEvent } from './models/game-event';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameEventsService } from './services';
import { vidConfig } from './configs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit, OnDestroy {
  vidConfig = vidConfig;
  events: GameEvent[] = [];

  private _subscriptions = new Subscription();

  constructor(private _gameEventService: GameEventsService) {}

  ngOnInit() {
    this._getGameEvents();
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  private _getGameEvents(): void {
    this._subscriptions.add(
      this._gameEventService.getGameEvents()
        .subscribe(res => {
          this.events = res;
        })
    );
  }
}
