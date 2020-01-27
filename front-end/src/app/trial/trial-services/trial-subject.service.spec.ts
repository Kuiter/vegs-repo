import { TestBed } from '@angular/core/testing';

import { TrialSubjectService } from './trial-subject.service';

describe('TrialSubjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrialSubjectService = TestBed.get(TrialSubjectService);
    expect(service).toBeTruthy();
  });
});
