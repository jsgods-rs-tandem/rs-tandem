import { Injectable } from '@nestjs/common';
import { User } from '@rs-tandem/shared';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // TODO: Replace with database
  getUsers(): User[] {
    return [
      {
        id: '1',
        email: 'alice@example.com',
        name: 'Alice Johnson',
        createdAt: '2025-01-15T00:00:00.000Z',
        updatedAt: '2025-06-01T00:00:00.000Z',
      },
      {
        id: '2',
        email: 'bob@example.com',
        name: 'Bob Smith',
        createdAt: '2025-03-22T00:00:00.000Z',
        updatedAt: '2025-07-10T00:00:00.000Z',
      },
      {
        id: '3',
        email: 'carol@example.com',
        name: 'Carol Williams',
        createdAt: '2025-05-08T00:00:00.000Z',
        updatedAt: '2025-08-15T00:00:00.000Z',
      },
    ];
  }
}
