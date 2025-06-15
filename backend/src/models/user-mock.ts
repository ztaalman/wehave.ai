import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
}

class UserMockModel {
  private users: User[] = [];
  private nextId: number = 1;

  constructor() {
    // Add some sample test users
    this.initializeSampleUsers();
  }

  private async initializeSampleUsers() {
    // Add a test user that matches the one in the original routes/users.ts
    await this.create({
      name: 'Test User',
      email: 'test-user-alpha-9x7y2z@wehave.ai',
      password: 'P@ssw0rdF0rTestingWehaveAI-9x7y2z!'
    });

    // Add some additional sample users
    await this.create({
      name: 'John Doe',
      email: 'john@wehave.ai',
      password: 'password123'
    });

    await this.create({
      name: 'Jane Smith',
      email: 'jane@wehave.ai',
      password: 'password456'
    });
  }

  async create(userData: UserInput): Promise<User> {
    const { name, email, password } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    
    const now = new Date();
    const newUser: User = {
      id: this.nextId++,
      name,
      email,
      password_hash,
      created_at: now,
      updated_at: now
    };

    this.users.push(newUser);
    
    // Return a copy of the user object without the password hash
    const { password_hash: _, ...userWithoutPassword } = newUser;
    return { ...newUser };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user ? { ...user } : null;
  }

  async findById(id: number): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  async update(id: number, userData: Partial<UserInput>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return null;
    }

    const user = this.users[index];
    const updatedUser = { ...user };

    if (userData.name) {
      updatedUser.name = userData.name;
    }

    if (userData.email) {
      updatedUser.email = userData.email;
    }

    if (userData.password) {
      updatedUser.password_hash = await bcrypt.hash(userData.password, 10);
    }

    updatedUser.updated_at = new Date();
    
    this.users[index] = updatedUser;
    return { ...updatedUser };
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length < initialLength;
  }
}

export default new UserMockModel();
