import { FlipData } from './flipData';
import { FlipObjectEntity } from '../flipObject/entity/FlipObjectEntity';
import { IFlipDataFileWorks } from './interface/IFlipDataFileWorks';
import { Stats } from 'fs';

describe('FlipData', () => {
  let flipData: FlipData;
  let mockFileWorks: IFlipDataFileWorks;

  beforeEach(() => {
    mockFileWorks = {
      fileExist: jest.fn(),
      saveJsonInFile: jest.fn(),
      loadFile: jest.fn(),
      fileInfo: jest.fn(),
    };

    flipData = new FlipData(mockFileWorks);
  });

  it('should initialize file when init is called', async () => {
    jest.spyOn(mockFileWorks, 'fileExist').mockReturnValue(false);

    await flipData.init();

    expect(mockFileWorks.saveJsonInFile).toHaveBeenCalledWith([]);

    expect(mockFileWorks.fileExist).toHaveBeenCalled();
    expect(mockFileWorks.saveJsonInFile).toHaveBeenCalled();
  });

  describe('getAll', () => {
    it('should get all flip data', async () => {
      const mockData = [
        { textExample1: 'testExample1' },
      ] as unknown as FlipObjectEntity[];

      jest.spyOn(mockFileWorks, 'loadFile').mockResolvedValue(mockData);

      const allFlipData = await flipData.getAll();

      expect(mockFileWorks.loadFile).toHaveBeenCalled();

      expect(allFlipData).toEqual(mockData);
    });
  });

  describe('getFlipDataInfo', () => {
    it('should get flip data info', async () => {
      const mockFlipData = [
        { textExample1: 'testExample1' },
      ] as unknown as FlipObjectEntity[];

      const mockFileInfo = { mtime: new Date() } as Stats;
      jest.spyOn(mockFileWorks, 'loadFile').mockResolvedValue(mockFlipData);
      jest.spyOn(mockFileWorks, 'fileInfo').mockResolvedValue(mockFileInfo);

      const flipDataInfo = await flipData.getFlipDataInfo();

      expect(mockFileWorks.loadFile).toHaveBeenCalled();
      expect(mockFileWorks.fileInfo).toHaveBeenCalled();

      expect(flipDataInfo).toEqual({
        flipData: mockFlipData,
        lastUpdate: mockFileInfo.mtime,
      });
    });
  });

  describe('update', () => {
    it('should update flip data', async () => {
      const mockFlipData = [
        { queriesFlipUuid: '123' /* Mock data */ },
      ] as FlipObjectEntity[];
      jest.spyOn(mockFileWorks, 'loadFile').mockResolvedValue(mockFlipData);

      const newFlipObject = {
        queriesFlipUuid: '123' /* Updated data */,
      } as FlipObjectEntity;

      const updatedFlipData = await flipData.update(newFlipObject);

      expect(mockFileWorks.loadFile).toHaveBeenCalled();
      expect(mockFileWorks.saveJsonInFile).toHaveBeenCalled();

      expect(updatedFlipData).toEqual([newFlipObject]);
    });
  });

  describe('add', () => {
    it('should add new flip data', async () => {
      const mockFlipData = [
        { queriesFlipUuid: '123' /* Mock data */ },
      ] as unknown as FlipObjectEntity[];
      jest.spyOn(mockFileWorks, 'loadFile').mockResolvedValue(mockFlipData);

      const newFlipObject = {
        queriesFlipUuid: '1234' /*  Data to add  */,
      } as FlipObjectEntity;

      const updatedFlipData = await flipData.add(newFlipObject);

      expect(mockFileWorks.loadFile).toHaveBeenCalled();
      expect(mockFileWorks.saveJsonInFile).toHaveBeenCalled();

      expect(updatedFlipData).toEqual([...mockFlipData, newFlipObject]);
    });
  });

  describe('remove', () => {
    it('should remove flip data', async () => {
      const mockFlipData = [
        { queriesFlipUuid: '123' /* Mock data */ },
      ] as FlipObjectEntity[];
      jest.spyOn(mockFileWorks, 'loadFile').mockResolvedValue(mockFlipData);

      const removeFlipObject: FlipObjectEntity = {
        queriesFlipUuid: '123' /* Data to remove */,
      } as FlipObjectEntity;

      const updatedFlipData = await flipData.remove(removeFlipObject);

      expect(mockFileWorks.loadFile).toHaveBeenCalled();
      expect(mockFileWorks.saveJsonInFile).toHaveBeenCalled();

      expect(updatedFlipData).toEqual([]);
    });
  });
});
