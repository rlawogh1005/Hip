import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { CreateExhibitionsMemberDto } from './dto/create-exhibitions_member.dto';
import { ExhibitionMember } from './entities/exhibition_member.entity';

@Controller('exhibition-members')
export class ExhibitionsMemberController {
    constructor(private readonly exhibitionsMemberService: ExhibitionsMemberService) {}

    @Post('register')
    async create(@Body() createExhibitionsMemberDto: CreateExhibitionsMemberDto): Promise<ExhibitionMember> {
        const exhibitionMember = await this.exhibitionsMemberService.create(createExhibitionsMemberDto);
        return exhibitionMember; // 생성된 전시 멤버 반환
    }

    @Get()
    async findAll(): Promise<ExhibitionMember[]> {
        const exhibitionMembers = await this.exhibitionsMemberService.findAll();
        return exhibitionMembers; // 모든 전시 멤버 반환
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<ExhibitionMember> {
        const exhibitionMember = await this.exhibitionsMemberService.findOne(id);
        return exhibitionMember; // 특정 전시 멤버 반환
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateData: Partial<CreateExhibitionsMemberDto>): Promise<ExhibitionMember> {
        const updatedExhibitionMember = await this.exhibitionsMemberService.update(id, updateData);
        return updatedExhibitionMember; // 업데이트된 전시 멤버 반환
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        await this.exhibitionsMemberService.remove(id);
        return; // 삭제 완료
    }
}
