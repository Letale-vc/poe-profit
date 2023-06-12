import { Test } from '@nestjs/testing';
import { UpdateFlipQueriesDto } from './dto/UpdateFlipQueries.dto';
import { FlipQueriesController } from './flip-queries-controller';

describe('FlipQueriesController', () => {
  let queriesController: FlipQueriesController;
  const queriesService = {
    getAll: jest.fn().mockResolvedValueOnce([]),
    getAllToClient: jest.fn().mockResolvedValueOnce([]),
    update: jest.fn(),
    remove: jest.fn(),
    add: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [FlipQueriesController], // Add
      providers: [
        {
          provide: 'FlipQueries',
          useValue: queriesService,
        },
      ], // Add
    }).compile();

    queriesController = moduleRef.get<FlipQueriesController>(
      FlipQueriesController,
    );
  });

  it('should be defined', () => {
    expect(queriesController).toBeDefined();
  });

  describe('getAll', () => {
    it('should be return clear array', async () => {
      expect(await queriesController.getAll()).toStrictEqual([]);
    });
  });

  describe('update', () => {
    it('should be call  one time function queriesService.update', async () => {
      const testBodyValues = {
        uuid: 'test',
      } as any as UpdateFlipQueriesDto;

      await queriesController.update(testBodyValues);

      expect(queriesService.update).toBeCalledTimes(1);
      expect(queriesService.update).toBeCalledWith(testBodyValues);
    });
    describe('delete', () => {
      it('should be call  one time function queriesService.remove', async () => {
        const testBodyValues = {
          cardQuery: 'test',
          itemQuery: 'test',
          uuid: 'test',
        } as any as UpdateFlipQueriesDto;

        await queriesController.delete(testBodyValues);
        expect(queriesService.remove).toBeCalledTimes(1);
        expect(queriesService.remove).toBeCalledWith(testBodyValues);
      });
    });
    describe('add', () => {
      it('should be call  one time function queriesService.add', async () => {
        const testBodyValues = {
          buyingQuery: 'test',
          sellingQuery: 'test',
          uuid: 'test',
        } as any as UpdateFlipQueriesDto;

        await queriesController.add(testBodyValues);
        expect(queriesService.add).toBeCalledTimes(1);
        expect(queriesService.add).toBeCalledWith(testBodyValues);
      });
    });
  });
});
