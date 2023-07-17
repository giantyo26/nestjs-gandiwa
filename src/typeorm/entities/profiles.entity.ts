import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profiles' })
export class Profiles {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column()
    displayName: string;

    @Column({ default: null })
    age: number ;

    @Column({ default: 'No bio available' })
    bio: string;
}