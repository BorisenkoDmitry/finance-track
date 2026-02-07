import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarService } from './avatarUser.service';
import { CurrentUserID } from '../user.docorator';

@Controller('avatar')
export class AvatarController {
  constructor(private avatarService: AvatarService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUserID() userId: string,
  ) {
    return this.avatarService.uploadAvatar(userId, file);
  }
  @Delete('delete')
  @UseInterceptors(FileInterceptor('file'))
  delete(@CurrentUserID() userId: string) {
    return this.avatarService.deleteAvatar(userId);
  }
}
