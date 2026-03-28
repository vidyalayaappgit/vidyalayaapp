import { Test, TestingModule } from '@nestjs/testing';

import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';

describe('NavigationController', () => {
  let controller: NavigationController;

  const mockService = {
    getNavigation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NavigationController],
      providers: [
        {
          provide: NavigationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NavigationController>(NavigationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});