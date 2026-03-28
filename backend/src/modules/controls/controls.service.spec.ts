import { Test, TestingModule } from '@nestjs/testing';

import { ControlsService } from './controls.service';
import { PostgresService } from '@core/database/postgres.service';

describe('ControlsService', () => {
  let service: ControlsService;

  const mockDb = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ControlsService,
        {
          provide: PostgresService,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<ControlsService>(ControlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});