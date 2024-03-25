import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { DeleteUserResponse } from "./dto/delete-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
     constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {};

     async findAll(): Promise<User[]> {
          return this.userModel.find().lean();
     };

     async findById(userId: string): Promise<User> {
          const user = await this.userModel.findOne({ userId }).lean();

          if (!user) {
               throw new NotFoundException(`User not found ${userId}`);
          };

          return user;
     };

     async findByEmail(email: string): Promise<User> {
          const user = await this.userModel.findOne({ email }).lean();
          console.log(user);

          if (!user) {
               throw new Error(`User not found ${email}`);
          };

          return user;
     };

     async create(user: CreateUserDto): Promise<User> {
          const alreadyExists = await this.userModel.exists({ email: user.email }).lean();

          if (alreadyExists) {
               throw new ConflictException(`User with email ${user.email} already exists`);
          };

          const passwordHash = await hash(user.password, 10);
          const userToCreate: User = { ...user, userId: randomUUID(), password: passwordHash };
          
          return this.userModel.create(userToCreate);
     };

     async updateById(userId: string, userUpdate: UpdateUserDto): Promise<User> {
          return this.userModel.findOneAndUpdate({ userId }, userUpdate, { new: true }).lean();
     };

     async remove(userId: string): Promise<DeleteUserResponse> {
          return this.userModel.deleteOne({ userId }).lean();
     };
};