import { TestBed } from '@angular/core/testing';

import { RoutingTrackerService } from './routing-tracker.service';

describe('RoutingTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutingTrackerService = TestBed.get(RoutingTrackerService);
    expect(service).toBeTruthy();
  });
});
