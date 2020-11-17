import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  async getTasks(gatTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(gatTasksFilterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task>  {
    const found = await this.taskRepository.findOne({where: {id, userId: user.id}})

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }

    return  found
  }

  createTask(createTaskDto: CreateTaskDto, user: User) {
    return this.taskRepository.createTask(createTaskDto, user)
  }

  async deleteTask(id: number, user: User): Promise<void> {
    
    const result = await this.taskRepository.delete({ id, userId: user.id })
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }
  }
  
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User  
  ): Promise<Task> {
   const task = await this.getTaskById(id, user)
   task.status = status
   await task.save()
   return task;
  }
}
