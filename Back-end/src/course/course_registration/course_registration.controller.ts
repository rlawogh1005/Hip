import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CourseRegistrationService } from './course_registration.service';
import { CreateRequestCourseRegistrationDto } from './dto/create-request-course_registration.dto';
import { UpdateRequestCourseRegistrationDto } from './dto/update-request-course_registration.dto';
import { GetAdminResponseCourseRegistrationDto } from './dto/get-admin-course_registration.dto';
import { CourseResponseDto } from '../courses/dto/course-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('courses/:course/courseRegistration')
export class CourseRegistrationController {
    constructor(private readonly courseRegistrationService: CourseRegistrationService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('register')
    @Roles('instructor', 'student')

    // 수강 신청
    async create(
        @Body() createRequestCourseRegistrationDto: CreateRequestCourseRegistrationDto, 
        @Param('course') course_id: number,
        @Request() req
    ): Promise<{ message: string }> {
        // 로그인된 user 저장
        const loginedUser = req.user.user_id;

        // 수강 신청 생성
        await this.courseRegistrationService.create(createRequestCourseRegistrationDto, course_id, loginedUser);

        return { 
            message: "수강 신청이 완료되었습니다."
        };
    }

    // <admin> 전체 수강 신청 정보 조회
    @Get()
    @Roles('admin')
    async findAllForAdmin(): Promise<{ message: string, data: GetAdminResponseCourseRegistrationDto[] }> {
        const foundRegistrations = await this.courseRegistrationService.findAllCoursesWithRegistrationsForAdmin();
        const responseDtos = foundRegistrations.map(responseDto => new GetAdminResponseCourseRegistrationDto(responseDto));
        return {
            message: "수강 신청 정보가 조회되었습니다.",
            data: responseDtos,
        };
    } 

    // <student,instructor> 수강 신청 가능 강의 조회
    @Get()
    @Roles('student','instructor')
    async findCourses(): Promise<{ message: string, data: CourseResponseDto[] }> {
        const generation = '3기';
        const courses = await this.courseRegistrationService.findCourses(generation);

        return {
            message: "수강 신청 정보가 조회되었습니다.",
            data: courses.map(course => new CourseResponseDto(course)),
        };
    }

    // 수강 신청 수정
    // @Patch(':id/update')
    // @Roles('admin')
    // async update(
    //     @Param('id') id: number, 
    //     @Body() updateCourseRegistrationDto: UpdateCourseRegistrationDto,
    //     @Param('course') courseId: number
    // ) {
    //     const data = this.courseRegistrationService.update(id, updateCourseRegistrationDto, courseId);
    //     return {
    //         message: "수강 신청이 정보가 업데이트되었습니다.",
    //         data: data,
    //     }
    // }

    // 수강 신청 삭제
    @Delete(':id/delete')
    @Roles('instructor', 'student')
    remove(
        @Param('id') id: number,
        @Param('course') courseId: number
    ) {
        const data = this.courseRegistrationService.remove(id, courseId);
        return {
            message: "수강 신청이 취소되었습니다.",
            data: data,
        }
    }
}
