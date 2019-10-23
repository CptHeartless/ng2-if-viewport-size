import {
  Directive,
  ElementRef, Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IfViewportSizeService, State } from './if-viewport-size.service';

@Directive({
  selector: '[ifViewportSize], [ngxIfViewportSize], [ngIfViewportSize], [libIfViewportSize]',
})
export class IfViewportSizeDirective implements OnInit, OnDestroy {
  @Input() set ifViewportSize(visibleWhen: State | Array<State>) {
    this.visibleWhen = visibleWhen;
  }

  protected visibleWhen: State | Array<State>;
  protected stateStream$: Subscription;

  constructor(
    @Inject(IfViewportSizeService) private readonly viewportSizeService: IfViewportSizeService,
    @Inject(TemplateRef) private readonly templateRef: TemplateRef<ElementRef>,
    @Inject(ViewContainerRef) private readonly viewContainer: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    this.updateVisibility(this.viewportSizeService.state);
    this.stateStream$ = this.viewportSizeService
      .state$.subscribe(this.updateVisibility.bind(this));
  }

  ngOnDestroy(): void {
    this.stateStream$.unsubscribe();
  }

  protected updateVisibility(state: State): void {
    const isVisible =  Array.isArray(this.visibleWhen)
      ? this.visibleWhen.some(breakpoint => state === breakpoint)
      : state === this.visibleWhen;

    if (isVisible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
