import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateSetDto } from './create-template-set.dto';

export class UpdateTemplateSetDto extends PartialType(CreateTemplateSetDto) {}
