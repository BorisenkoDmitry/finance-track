import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../auth.entity';
import { join } from 'path';
import { mkdir, unlink } from 'fs/promises';
import { createWriteStream, existsSync, WriteStream } from 'fs';
import { CurrentUserID } from '../user.docorator';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AvatarService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  private readonly AVATAR_DIR = join(
    __dirname,
    '..',
    '..',
    '..',
    'public',
    'avatars',
  );
  async uploadAvatar(
    @CurrentUserID() userId: string,
    file: Express.Multer.File,
  ) {
    // 1. Генерируем уникальное имя файла

    console.log(this.AVATAR_DIR);
    const ext = file.originalname.split('.').pop();
    const filename = `user-${userId}.${ext}`;
    const filepath = join(this.AVATAR_DIR, filename);

    // 2. Создаём директорию, если её нет
    if (!existsSync(this.AVATAR_DIR)) {
      await mkdir(this.AVATAR_DIR, { recursive: true });
    }

    // 3. Сохраняем файл
    const writeStream: WriteStream = createWriteStream(filepath);

    writeStream.write(file.buffer);
    writeStream.end();

    // 4. Обновляем запись в БД
    await this.userRep.update(userId, {
      avatarPath: `avatars/${filename}`,
    });

    const user = await this.userRep.findOne({
      where: {
        id: userId,
      },
      relations: ['roles'],
    });
    if (!user) {
      return;
    }
    const { email, id, name, surname, roles } = user;
    return {
      user: {
        email,
        id,
        name,
        surname,
        roles,
        imageUrl: `avatars/${filename}?v=${Date.now()}`,
      },
    };
  }

  async deleteAvatar(@CurrentUserID() userId: string) {
    const user = await this.userRep.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user?.avatarPath) {
      // Аватар не установлен — ничего удалять не нужно
      return;
    }

    // 2. Формируем полный путь к файлу
    const filepath = join(this.AVATAR_DIR, user.avatarPath);

    try {
      // 3. Проверяем существование файла на диске
      if (existsSync(filepath)) {
        // 4. Удаляем файл (Promise-версия, безопасная для async/await)
        await unlink(filepath);
        console.log(`Файл удалён: ${filepath}`);
      } else {
        console.warn(`Файл не найден на диске: ${filepath}`);
      }

      // 5. Обнуляем поле в БД
      await this.userRep.update(userId, { avatarPath: null });
      const { email, id, name, surname, roles } = user;
      return {
        user: { email, id, name, surname, roles, imageUrl: null },
      };
    } catch (error) {
      console.error('Ошибка при удалении аватара:', error);
      throw new Error('Не удалось удалить аватар');
    }
  }
}
