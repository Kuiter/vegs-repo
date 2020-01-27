import { TestBed } from '@angular/core/testing';

import { TrialLabelService } from './trial-label.service';

describe('TrialLabelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrialLabelService = TestBed.get(TrialLabelService);
    expect(service).toBeTruthy();
  });
});
