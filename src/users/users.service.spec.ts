import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService)
  });

 describe('Get Users', () =>{
  it('should call db', async ()=>{
    const users = [{
      username: 'testing',
      password: 'testing'
    },
    {
      username: 'testing2',
      password: 'testing2'
    }]

    const mock = jest.spyOn(prisma.users, 'findMany')
    await service.getUsers()

    expect(mock).toBeCalled()
  })
 })
});
