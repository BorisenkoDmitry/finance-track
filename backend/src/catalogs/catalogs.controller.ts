import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUserID } from 'src/auth/user.docorator';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDTO } from './dto/create-catalog-dto';
import { GetCatalogsDTO } from './dto/get-catalogs.dto';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly CatalogsService: CatalogsService) {}

  @Get()
  getAll(@Query() GetCatalogsDTO: GetCatalogsDTO, @CurrentUserID() id: string) {
    return this.CatalogsService.getAll(GetCatalogsDTO, id);
  }

  @Post()
  createCatalog(
    @Body() CreateCatalogDTO: CreateCatalogDTO,
    @CurrentUserID() id: string,
  ) {
    return this.CatalogsService.createCatalog(CreateCatalogDTO, id);
  }

  @Patch(':id')
  updateCatalog(
    @Body() CreateCatalogDTO: CreateCatalogDTO,
    @Param('id') catalogId: string,
    @CurrentUserID() id: string,
  ) {
    return this.CatalogsService.updateCatalog(CreateCatalogDTO, catalogId, id);
  }
  @Delete(':id')
  async deleteCatalog(
    @Param('id') id: string,
    @CurrentUserID() userId: string,
  ) {
    return this.CatalogsService.deleteCatalog(id, userId);
  }
}
