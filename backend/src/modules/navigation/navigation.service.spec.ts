import { Test, TestingModule } from '@nestjs/testing';

import { NavigationService } from './navigation.service';
import { PostgresService } from '@core/database/postgres.service';

describe('NavigationService', () => {
  let service: NavigationService;

  const mockDb = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NavigationService,
        {
          provide: PostgresService,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<NavigationService>(NavigationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});