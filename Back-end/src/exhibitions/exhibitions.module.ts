import { Module } from '@nestjs/common';
import { ExhibitionService } from './exhibitions.service';
import { ExhibitionController } from './exhibitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibition } from './exhibition.entity';
import { RolesGuard } from '../guards/roles.guard';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Exhibition]),
    UsersModule,
  ],
  providers: [ExhibitionService,RolesGuard],
  controllers: [ExhibitionController]
})
export class ExhibitionModule {}
