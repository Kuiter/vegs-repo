import { TestBed } from '@angular/core/testing';

import { TrialTreatmentService } from './trial-treatment.service';

describe('TrialTreatmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrialTreatmentService = TestBed.get(TrialTreatmentService);
    expect(service).toBeTruthy();
  });
});
