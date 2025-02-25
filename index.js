import { initServer } from './configs/server.js';
import { config } from 'dotenv';
import { defaultAdmin } from './src/users/user.controller.js';
import { defaultCategory } from './src/category/category.controller.js';

config();
initServer();
defaultAdmin();
defaultCategory();