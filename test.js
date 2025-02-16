const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('./index');
const authController = require('./controllers/AuthController');
const categoryController = require('./controllers/CategoryController');
const categoryService = require('./services/CategoryService');
const { registerUser, loginUser } = require('./services/AuthService');
const generateToken = require('./utils/generateToken');

jest.mock('./services/AuthService');
jest.mock('./services/CategoryService');
jest.mock('./utils/generateToken');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(process.env.MONGODB_URL, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('AuthController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should register a user successfully', async () => {
        registerUser.mockResolvedValue({ _id: 'user123' });
        generateToken.mockImplementation(() => { });

        const req = { body: { name: 'John', email: 'john@example.com', password: 'password' } };
        const res = { handler: { success: jest.fn() } };

        await authController.signup(req, res);

        expect(registerUser).toHaveBeenCalledWith('John', 'john@example.com', 'password');
        expect(res.handler.success).toHaveBeenCalledWith('User registered successfully');
    });

    test('should handle login successfully', async () => {
        loginUser.mockResolvedValue({ _id: 'user123' });
        generateToken.mockImplementation(() => { });

        const req = { body: { email: 'john@example.com', password: 'password' } };
        const res = { handler: { success: jest.fn() } };

        await authController.signin(req, res);

        expect(loginUser).toHaveBeenCalledWith('john@example.com', 'password');
        expect(res.handler.success).toHaveBeenCalledWith('Login successfully', { _id: 'user123' });
    });

    test('should handle logout', async () => {
        const req = {};
        const res = { clearCookie: jest.fn(), handler: { success: jest.fn() } };

        await authController.logout(req, res);

        expect(res.clearCookie).toHaveBeenCalledWith('jwt');
        expect(res.handler.success).toHaveBeenCalledWith('Logout successfully');
    });
});

describe('CategoryController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a category', async () => {
        categoryService.createCategory.mockResolvedValue({ _id: 'cat123', name: 'Electronics' });

        const req = { body: { name: 'Electronics' } };
        const res = { handler: { success: jest.fn() } };

        await categoryController.createCategory(req, res);

        expect(categoryService.createCategory).toHaveBeenCalledWith({ name: 'Electronics' });
        expect(res.handler.success).toHaveBeenCalledWith({ _id: 'cat123', name: 'Electronics' }, 'Category created successfully');
    });

    test('should update a category', async () => {
        categoryService.updateCategory.mockResolvedValue({ _id: 'cat123', name: 'Updated Name', isActive: true, parent: null });

        const req = { params: { id: 'cat123' }, body: { name: 'Updated Name', isActive: true, parent: null } };
        const res = { handler: { success: jest.fn(), badRequest: jest.fn(), notFound: jest.fn() } };

        await categoryController.updateCategory(req, res);

        expect(categoryService.updateCategory).toHaveBeenCalledWith('cat123', { name: 'Updated Name', isActive: true, parent: null });
        expect(res.handler.success).toHaveBeenCalledWith({ _id: 'cat123', name: 'Updated Name', isActive: true, parent: null }, 'Category updated successfully');
    });

    test('should return 400 for missing category update fields', async () => {
        const req = { params: { id: 'cat123' }, body: {} };
        const res = { handler: { badRequest: jest.fn() } };

        await categoryController.updateCategory(req, res);

        expect(res.handler.badRequest).toHaveBeenCalledWith('Missing required fields: name, isActive, or parent.');
    });

    test('should fetch category tree', async () => {
        categoryService.getCategoriesTree.mockResolvedValue([{ _id: 'cat123', name: 'Electronics' }]);

        const req = {};
        const res = { handler: { success: jest.fn() } };

        await categoryController.getCategoriesTree(req, res);

        expect(categoryService.getCategoriesTree).toHaveBeenCalled();
        expect(res.handler.success).toHaveBeenCalledWith([{ _id: 'cat123', name: 'Electronics' }], 'Category fetched successfully');
    });

    test('should delete a category', async () => {
        categoryService.deleteCategory.mockResolvedValue(true);

        const req = { params: { id: 'cat123' } };
        const res = { handler: { success: jest.fn(), notFound: jest.fn() } };

        await categoryController.deleteCategory(req, res);

        expect(categoryService.deleteCategory).toHaveBeenCalledWith('cat123');
        expect(res.handler.success).toHaveBeenCalledWith('Category deleted and subcategories reassigned');
    });

    test('should return 404 if category not found for deletion', async () => {
        categoryService.deleteCategory.mockResolvedValue(null);

        const req = { params: { id: 'cat123' } };
        const res = { handler: { notFound: jest.fn() } };

        await categoryController.deleteCategory(req, res);

        expect(res.handler.notFound).toHaveBeenCalledWith('Category not found');
    });
});
