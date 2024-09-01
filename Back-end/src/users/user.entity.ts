import { Entity, Column, PrimaryGeneratedColumn ,OneToMany} from 'typeorm';
import { Role } from '../enums/role.enum';
import { Exhibition } from '../exhibitions/exhibition.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @Column()
    id: string;

    @Column()
    password: string;
    
    @Column()
    email: string;

    @Column()
    generation: string;

    @Column()
    nick_name: string;

    @Column({
        type: 'enum',
        enum: Role, // Role enum 사용
    })
    user_role: Role; // Role 타입으로 변경

    @OneToMany(() => Exhibition, exhibition => exhibition.user,{cascade:true})
    exhibition: Exhibition[];
}