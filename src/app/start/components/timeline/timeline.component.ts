import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GameEvent, VideoConfig } from '../../models';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnChanges, OnDestroy {
  @Input() config: VideoConfig;
  @Input() events: GameEvent[] = [];

  actionByKeysUp = {
    'arrowright': this._fastForward,
    'arrowleft': this._rewind,
    'space': this._startStop
  };
  element: HTMLVideoElement;
  sliderPosition = 0;

  NORMALIZE_SLIDER: number; // slider should be at the center of clicked game event block
  PXLS_PER_SEC: number;
  private _SLIDER_WIDTH = 5;
  private _SEEK_STEP = 5;
  private _EVENT_BORDER = 2;
  private _OVERLAP_SPACE = 2;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.config && changes.config.currentValue) {
      this._initTimeline(changes.config.currentValue);
    }
    if (changes.events && changes.events.currentValue) {
      this._groupEvents(changes.events.currentValue);
    }
  }

  goToGameEvent(time: number): void {
    this.element.currentTime = time;
    this._setSliderPosition();
  }

  private _initTimeline(config: VideoConfig): void {
    this.element = document.querySelector(config.id) as HTMLVideoElement;
    this.element.addEventListener('loadedmetadata', (e: any) => {
      if (e) {
        this.PXLS_PER_SEC = (config.width - this._SLIDER_WIDTH * 0.5) / e.target.duration;
        this.NORMALIZE_SLIDER = (config.eventWidth + this._EVENT_BORDER - this._SLIDER_WIDTH) * 0.5;
        this.element.addEventListener('progress', this._onSeeking);
        this.element.removeEventListener('loadedmetadata', null);
      }
    });
    document.addEventListener('keydown', this._onKeyDown);
  }

  private _groupEvents(events: GameEvent[]): void {
    if (events.length) {
      const overlapParam = this._OVERLAP_SPACE + this.config.eventWidth;
      this.events = this._getEventPosition(events);
      const copy = events.slice();
      copy.forEach((event, i) => {
        event.child = [];
        events.forEach(item => {
          const param = item.left - event.left;
          if (param < overlapParam && param > 0) {
            event.child.push(item);
            copy.splice(i, 1);
          }
        });
        if (event.child.length) {
          event.child = [event].concat(event.child);
        }
      });
    }
  }

  private _getEventPosition(events): GameEvent[] {
    return events.map((event) => {
      event.left = event.time * this.PXLS_PER_SEC - this.NORMALIZE_SLIDER;
      return event;
    });
  }

  private _onKeyDown = (e: KeyboardEvent): void => {
    const action = this.actionByKeysUp[e.code.toLowerCase()];
    if (e && action) {
      action.call(this);
      this._setSliderPosition();
    }
  }

  private _onSeeking = (e): void => {
    this._setSliderPosition();
  }


  private _startStop(): void {
    this.element.paused ? this.element.play() : this.element.pause();
  }

  private _fastForward(): void {
    this.element.currentTime = this.element.currentTime + this._SEEK_STEP;
  }

  private _rewind(): void {
    this.element.currentTime = this.element.currentTime - this._SEEK_STEP;
  }

  private _setSliderPosition(): void {
    this.sliderPosition = 0;
    if (this.element && this.element.duration) {
      this.sliderPosition = this.PXLS_PER_SEC * this.element.currentTime;
    }
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this._onKeyDown);
  }

}
