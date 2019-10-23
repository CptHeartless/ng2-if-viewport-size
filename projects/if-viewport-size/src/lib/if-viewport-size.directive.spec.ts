import {
  Component,
  ElementRef,
  Injectable,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subscription } from 'rxjs';
import { IfViewportSizeDirective } from './if-viewport-size.directive';
import { IfViewportSizeService, State } from './if-viewport-size.service';

@Component({
  template: `
    <span *ifViewportSize="'small'">Small viewport</span>
    <span *ifViewportSize="'medium'">Medium viewport</span>
    <span *ifViewportSize="'large'">Large viewport</span>
    <span *ifViewportSize="['small', 'medium']">Small and medium viewport</span>
    <span *ifViewportSize="['medium', 'large']">Large and medium viewports</span>
  `,
})
class TestComponent { }

@Injectable()
class IfViewportSizeServiceStub {
  state: State = 'small';
  state$: Observable<State> = new Observable(() => {});
}

describe('[IfViewportSizeDirective] DOM', () => {
  let fixture: ComponentFixture<TestComponent>;
  let hostElement: ElementRef;
  let service: IfViewportSizeServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, IfViewportSizeDirective],
      providers: [
        {
          provide: IfViewportSizeService,
          useValue: new IfViewportSizeServiceStub(),
        },
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    hostElement = fixture.nativeElement;
    service = TestBed.get(IfViewportSizeService) as IfViewportSizeServiceStub;
  });

  test.each([
    ['Small Viewport', 'small'],
    ['Medium Viewport', 'medium'],
    ['Large Viewport', 'large'],
  ])('rendering for %s', (_, state: State) => {
    service.state = state;
    fixture.detectChanges();

    expect(hostElement)
      .toMatchSnapshot();
  });
});

describe('IfViewportSizeDirective {}', () => {
  // Directive dependencies
  let viewContainerStub: Partial<ViewContainerRef>;
  let templateRefStub: Partial<TemplateRef<any>>;
  let serviceFixture: IfViewportSizeServiceStub;

  // Directive subscription teardown spies
  let onSubSpy: jest.SpyInstance<Subscription, Array<(state: State) => void>>;
  let onUnsubSpy: jest.SpyInstance<void, Array<() => void>>;

  // Directive instance
  let instance: IfViewportSizeDirective;

  beforeEach(() => {
    serviceFixture = new IfViewportSizeServiceStub();

    const subFixture = new Subscription();
    onSubSpy = jest.spyOn(serviceFixture.state$, 'subscribe')
      .mockReturnValue(subFixture);
    onUnsubSpy = jest.spyOn(subFixture, 'unsubscribe');

    viewContainerStub = {
      createEmbeddedView: jest.fn(),
      clear: jest.fn(),
    };
    templateRefStub = {};

    instance = new IfViewportSizeDirective(
      serviceFixture as IfViewportSizeService,
      templateRefStub as TemplateRef<ElementRef>,
      viewContainerStub as ViewContainerRef,
    );

    instance.ifViewportSize = 'small';
  });

  test('.ngOnInit() when not visible', () => {
    serviceFixture.state = 'medium';

    instance.ngOnInit();

    expect(viewContainerStub.clear)
      .toBeCalled();
    expect(serviceFixture.state$.subscribe)
      .toBeCalled();
  });

  test('.ngOnInit() when visible', () => {
    serviceFixture.state = 'small';

    instance.ngOnInit();

    expect(viewContainerStub.createEmbeddedView)
      .toBeCalledWith(templateRefStub);
    expect(onSubSpy)
      .toBeCalled();
  });

  test('.ngOnDestroy()', () => {
    instance.ngOnInit();

    expect(onUnsubSpy).not
      .toBeCalled();
    instance.ngOnDestroy();
    expect(onUnsubSpy)
      .toBeCalled();
  });

  it('should be hidden on event', () => {
    instance.ngOnInit();
    const handler = onSubSpy.mock.calls[0][0];

    expect(viewContainerStub.clear)
      .toHaveBeenCalledTimes(0);
    handler('large');
    expect(viewContainerStub.clear)
      .toHaveBeenCalledTimes(1);
  });

  test('should be shown on event', () => {
    serviceFixture.state = 'large';
    instance.ngOnInit();
    const handler = onSubSpy.mock.calls[0][0];

    expect(viewContainerStub.createEmbeddedView)
      .toHaveBeenCalledTimes(0);
    handler('small');
    expect(viewContainerStub.createEmbeddedView)
      .toHaveBeenCalledTimes(1);
    expect(viewContainerStub.createEmbeddedView)
      .toBeCalledWith(templateRefStub);
  });
});
