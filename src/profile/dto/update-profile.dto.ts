import {
    IsEmail,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class UpdateProfileDto {
    @IsOptional()
    displayName?: string;
  
    @IsOptional()
    age?: number;
  
    @IsString()
    @IsOptional()
    bio?: string;
  }