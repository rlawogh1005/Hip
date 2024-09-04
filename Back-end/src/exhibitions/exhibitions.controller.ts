import { Controller, UseGuards } from '@nestjs/common';
import { ExhibitionService } from './exhibitions.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { Exhibition } from './exhibition.entity';
import { Get, Post, Body, Query, Param, Delete,Patch, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../guards/roles.guard';


@Controller('exhibitions')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService) {}

    @Post('register')
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('file')) // 'file'은 전송할 파일의 필드 이름입니다.
    async create(
        @Body() createExhibitionDto: CreateExhibitionDto,
        @UploadedFile() file: Express.Multer.File // 파일을 인자로 받음
    ): Promise<{ message: string; exhibition: Exhibition }> {
        const exhibition = await this.exhibitionService.create(createExhibitionDto, file);
        return { message: '등록이 완료되었습니다', exhibition };
    }
    // 모든 전시 조회
    @Get()
    async findAll(): Promise<{ message: string; exhibitions: Exhibition[] }> {
        const exhibitions = await this.exhibitionService.findAll();
        return { message: '모든 전시 조회를 완료했습니다.', exhibitions };
    }

    // 특정 전시 조회
    @Get(':exhibition_title')
    async findOne(@Param('exhibition_title') exhibitionTitle: string): Promise<{ message: string; exhibition: Exhibition }> {
        const exhibition = await this.exhibitionService.findOne(exhibitionTitle);
        return { message: '전시 조회를 완료했습니다.', exhibition };
    }

    // 내용이나 제목, 내용 + 제목 으로 키워드 조회
    @Get('search')
    async searchExhibitions(
        @Query('keyword') keyword: string,
        @Query('searchIn') searchIn: 'title' | 'description' | 'both',
    ): Promise<Exhibition[]> {
        return this.exhibitionService.searchExhibitions(keyword, searchIn);
    }

    // 날짜 시간순 정렬
    @Get('sorted-by-date')
    async getExhibitionsSortedByDate(
        @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    ): Promise<Exhibition[]> {
        return this.exhibitionService.getExhibitionsSortedByDate(order);
    }

    // 기수별 정렬
    @Get('sorted-by-generation')
    async getExhibitionsSortedByGeneration(
        @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    ): Promise<Exhibition[]> {
        return this.exhibitionService.getExhibitionsSortedByGeneration(order);
    }
    
    @Delete(':exhibition_title')
    @UseGuards(RolesGuard)
    async remove(@Param('exhibition_title') exhibitionTitle: string): Promise<{ message: string }> {
        await this.exhibitionService.remove(exhibitionTitle);
        return { message: '전시가 삭제되었습니다.' };
    }

 
    // @Patch(':exhibition_title')
    // async update(
    //     @Param('exhibition_title') exhibitionTitle: string,
    //     @Body() body: UpdateExhibitionDto // DTO 사용
    // ): Promise<{ message: string }> {
    //     try {
    //         await this.exhibitionService.updateExhibition(
    //             exhibitionTitle,
    //             body // 두 번째 인자로 DTO를 전달
    //         );
    
    //         return { message: '전시 정보가 성공적으로 업데이트되었습니다.' };
    //     } catch (error) {
    //         if (error.message === '전시를 찾을 수 없습니다') {
    //             throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    //         } else if (error.message === '전시 제목이 이미 존재합니다') {
    //             throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //         }
    //         throw new HttpException('업데이트 중 오류가 발생했습니다', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
    @Patch(':exhibition_title')
    @UseGuards(RolesGuard)
async update(
    @Param('exhibition_title') exhibitionTitle: string,
    @Body() body: UpdateExhibitionDto // DTO 사용
): Promise<{ message: string }> {
    try {
        await this.exhibitionService.updateExhibition(
            exhibitionTitle,
            body // 두 번째 인자로 DTO를 전달
        );

        return { message: '전시 정보가 성공적으로 업데이트되었습니다.' };
    } catch (error) {
        if (error.message === '전시를 찾을 수 없습니다') {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        } else if (error.message === '전시 제목이 현재 제목과 동일합니다' || error.message === '전시 제목이 이미 존재합니다') {
            throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
        throw new HttpException('업데이트 중 오류가 발생했습니다', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
}
