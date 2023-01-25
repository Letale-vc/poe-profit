import { Controller, Delete, Get, Inject, Post, Put } from '@nestjs/common';
import { FlipQueries } from '../meApp/flipQueries/FlipQueries';
import { AddFlipQueryDto } from './dto/add-flip-query.dto';
import { UpdateFlipQueriesDto } from './dto/UpdateFlipQueries.dto';
import { FlipQueriesValidBody } from './flip-queries.decorator';

@Controller('api/flipQueries')
export class FlipQueriesController {
  constructor(
    @Inject('FlipQueries')
    private readonly flipQueries: FlipQueries,
  ) {}

  @Get()
  async getAll() {
    return this.flipQueries.getAllToClient();
  }

  @Put()
  async update(@FlipQueriesValidBody() queryFlipDto: UpdateFlipQueriesDto) {
    await this.flipQueries.update(queryFlipDto);
  }

  @Post()
  async add(@FlipQueriesValidBody() addFlipQueryDto: AddFlipQueryDto) {
    await this.flipQueries.add(addFlipQueryDto);
  }

  @Delete()
  async delete(@FlipQueriesValidBody() queryFlipDto: UpdateFlipQueriesDto) {
    await this.flipQueries.remove(queryFlipDto);
  }
}
