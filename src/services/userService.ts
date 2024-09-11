// src/services/userService.ts

import { users } from '@prisma/client';
import prisma from '../prisma/prismaClient';
prisma.users



class UserService {
  // Method to get all users
  async getAll(): Promise<users[]> {
    try {
      return await prisma.users.findMany();
      
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Could not fetch users");
    }
  }
}

export default new UserService();
