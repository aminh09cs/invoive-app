import { Injectable } from '@nestjs/common';
import { PORT } from '@common/constants/lib/common.constant';

@Injectable()
export class AppService {
  getData(): { message: string } {
    console.log('API is running', PORT);
    return { message: 'Hello API' };
  }
}
