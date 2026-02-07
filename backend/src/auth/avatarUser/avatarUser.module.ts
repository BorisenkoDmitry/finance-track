import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth.entity';
import { AvatarController } from './avatarUser.controller';
import { AvatarService } from './avatarUser.service';

@Module({
  controllers: [AvatarController],
  providers: [AvatarService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AvatarModule {}
