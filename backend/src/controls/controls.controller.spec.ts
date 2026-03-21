import { Test, TestingModule } from '@nestjs/testing';
import { ControlsController } from './controls.controller';

describe('ControlsController', () => {
  let controller: ControlsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlsController],
    }).compile();

    controller = module.get<ControlsController>(ControlsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
