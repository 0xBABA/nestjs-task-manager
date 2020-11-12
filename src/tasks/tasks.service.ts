import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  async getTasks(gatTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(gatTasksFilterDto);
  }

  async getTaskById(id: number): Promise<Task>  {
    const found = await this.taskRepository.findOne(id)

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }

    return  found
  }

  createTask(createTaskDto: CreateTaskDto) {
    return this.taskRepository.createTask(createTaskDto)
  }

  async deleteTask(id: number): Promise<void> {
    
    const result = await this.taskRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }
  }
  
 async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
   const task = await this.getTaskById(id)
   task.status = status
   await task.save()
   return task;
  }
}
