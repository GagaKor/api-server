import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiVersionOne(): string {
    return 'Hello Api Version 1!';
  }

  getApiVersionTwo(): string {
    return 'Hello Api Version 2!';
  }
}
