import rewire from 'rewire';
import sinon from 'sinon';
import { expect } from 'chai';
import { HttpStatus } from '../shared/httpStatusCodes';

const blogRoutes = rewire('./blogRoutes');

describe('blogRoutes', () => {
	describe('createBlog', () => {
		const createBlog = blogRoutes.__get__('createBlog');
		const mockCreateBlog = sinon.stub();
		let mockReq: any;
		let mockRes: any;

		beforeEach(() => {
			blogRoutes.__set__({
				blogService: {
					createBlog: mockCreateBlog,
				},
			});

			mockReq = {
				body: {},
				userId: 'mockUserId',
			};

			mockRes = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub(),
			};
			mockCreateBlog.reset();
		});

		it('should return a success response for a valid request', async () => {
			mockReq.body = {
				title: 'mockTitle',
				content: 'mockContent',
			};
			mockCreateBlog.resolves({
				status: HttpStatus.CREATED,
				success: true,
				blogId: 'mockBlogId',
			});

			await createBlog(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.CREATED);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.CREATED,
				success: true,
				blogId: 'mockBlogId',
			});
			expect(mockCreateBlog).to.have.been.calledWithExactly(
				{ title: 'mockTitle', content: 'mockContent' },
				'mockUserId',
			);
		});

		it('should return an error response when title or content are missing', async () => {
			await createBlog(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.BAD_REQUEST);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.BAD_REQUEST,
				success: false,
				message: 'Blog title and content are required.',
			});
			expect(mockCreateBlog).not.to.have.been.called;
		});

		it('should catch any errors thrown within the controller and return an error response', async () => {
			mockReq.body = {
				title: 'mockTitle',
				content: 'mockContent',
			};

			mockCreateBlog.rejects(new Error('Mock error'));

			await createBlog(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.INTERNAL_SERVER_ERROR);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				success: false,
				message: 'Mock error',
			});
			expect(mockCreateBlog).to.have.been.calledWithExactly(
				{ title: 'mockTitle', content: 'mockContent' },
				'mockUserId',
			);
		});
	});

	describe('updateBlog', () => {
		const updateBlog = blogRoutes.__get__('updateBlog');
		const mockUpdateBlog = sinon.stub();
		let mockReq: any;
		let mockRes: any;

		beforeEach(() => {
			blogRoutes.__set__({
				blogService: {
					updateBlog: mockUpdateBlog,
				},
			});

			mockReq = {
				body: {},
				userId: 'mockUserId',
				params: {},
			};

			mockRes = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub(),
			};
			mockUpdateBlog.reset();
		});

		it('should return a success response for a valid request', async () => {
			mockReq.params = {
				blogId: 'mockBlogId',
			};
			mockReq.body = {
				title: 'mockUpdatedTitle',
			};

			mockUpdateBlog.resolves({
				success: true,
				status: HttpStatus.OK,
				message: 'Blog updated',
			});

			await updateBlog(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.OK);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.OK,
				success: true,
				message: 'Blog updated',
			});
			expect(mockUpdateBlog).to.have.been.calledWithExactly(
				{ title: 'mockUpdatedTitle', content: '' },
				'mockBlogId',
				'mockUserId',
			);
		});

		it('should return a error response if blogId is missing', async () => { // Case will not happen in a real scenario, but the check is there for safety
			mockReq.body = {
				title: 'mockUpdatedTitle',
			};

			await updateBlog(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.BAD_REQUEST);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.BAD_REQUEST,
				success: false,
				message: 'Blog id is required.',
			});
			expect(mockUpdateBlog).not.to.have.been.called;
		});

		it('should return a error response no title and content are provided to update', async () => {
			mockReq.params = {
				blogId: 'mockBlogId',
			};

			await updateBlog(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.BAD_REQUEST);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.BAD_REQUEST,
				success: false,
				message: 'Provide title or content to update.',
			});
			expect(mockUpdateBlog).not.to.have.been.called;
		});

		it('should handle any thrown errors within the controller', async () => {
			mockReq.params = {
				blogId: 'mockBlogId',
			};
			mockReq.body = {
				title: 'mockUpdatedTitle',
			};

			mockUpdateBlog.rejects(new Error('Mock error'));

			await updateBlog(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.INTERNAL_SERVER_ERROR);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				success: false,
				message: 'Mock error',
			});
			expect(mockUpdateBlog).to.have.been.calledWithExactly(
				{ title: 'mockUpdatedTitle', content: '' },
				'mockBlogId',
				'mockUserId',
			);
		});
	});

	describe('deleteBlog', () => {
		const deleteBlog = blogRoutes.__get__('deleteBlog');
		const mockDeleteBlog = sinon.stub();
		let mockReq: any;
		let mockRes: any;

		beforeEach(() => {
			blogRoutes.__set__({
				blogService: {
					deleteBlog: mockDeleteBlog,
				},
			});

			mockReq = {
				userId: 'mockUserId',
				params: {},
			};

			mockRes = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub(),
			};
			mockDeleteBlog.reset();
		});

		it('should return a success response for a valid request', async () => {
			mockReq.params = {
				blogId: 'mockBlogId',
			};

			mockDeleteBlog.resolves({
				success: true,
				status: HttpStatus.OK,
				message: 'Blog deleted',
			});

			await deleteBlog(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.OK);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.OK,
				success: true,
				message: 'Blog deleted',
			});
			expect(mockDeleteBlog).to.have.been.calledWithExactly(
				'mockBlogId',
				'mockUserId',
			);
		});

		it('should return a error response if blogId is missing', async () => { // Case will not happen in a real scenario, but the check is there for safety
			await deleteBlog(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.BAD_REQUEST);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.BAD_REQUEST,
				success: false,
				message: 'Blog id is required.',
			});
			expect(mockDeleteBlog).not.to.have.been.called;
		});

		it('should handle any thrown errors within the controller', async () => {
			mockReq.params = {
				blogId: 'mockBlogId',
			};

			mockDeleteBlog.rejects(new Error('Mock error'));

			await deleteBlog(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.INTERNAL_SERVER_ERROR);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				success: false,
				message: 'Mock error',
			});
			expect(mockDeleteBlog).to.have.been.calledWithExactly(
				'mockBlogId',
				'mockUserId',
			);
		});
	});

	describe('getAllBlogs', () => {
		const getAllBlogs = blogRoutes.__get__('getAllBlogs');
		const mockGetAllBlogs = sinon.stub();
		let mockReq: any;
		let mockRes: any;

		beforeEach(() => {
			blogRoutes.__set__({
				blogService: {
					getAllBlogs: mockGetAllBlogs,
				},
			});

			mockReq = {
				userId: 'mockUserId',
			};

			mockRes = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub(),
			};
			mockGetAllBlogs.reset();
		});

		it('should return a success response for a valid request', async () => {
			mockGetAllBlogs.resolves({
				success: true,
				status: HttpStatus.OK,
				blogs: ['mockBlog', 'mockBlog'],
			});

			await getAllBlogs(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.OK);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: true,
				status: HttpStatus.OK,
				blogs: ['mockBlog', 'mockBlog'],
			});
			expect(mockGetAllBlogs).to.have.been.calledWithExactly('mockUserId');
		});

		it('should catch any thrown errors within the controller and return an error response', async () => {
			mockGetAllBlogs.rejects(new Error('mock error'));

			await getAllBlogs(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.INTERNAL_SERVER_ERROR);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'mock error',
			});
			expect(mockGetAllBlogs).to.have.been.calledWithExactly('mockUserId');
		});
	});

	describe('getBlogById', () => {
		const getBlogById = blogRoutes.__get__('getBlogById');
		const mockGetBlogById = sinon.stub();
		let mockReq: any;
		let mockRes: any;

		beforeEach(() => {
			blogRoutes.__set__({
				blogService: {
					getBlogById: mockGetBlogById,
				},
			});

			mockReq = {
				userId: 'mockUserId',
				params: {},
			};

			mockRes = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub(),
			};
			mockGetBlogById.reset();
		});

		it('should return a success response for a valid request', async () => {
			mockReq.params = { blogId: 'mockBlogId' };
			mockGetBlogById.resolves({
				success: true,
				status: HttpStatus.OK,
				blog: 'mockBlog',
			});

			await getBlogById(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.OK);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: true,
				status: HttpStatus.OK,
				blog: 'mockBlog',
			});
			expect(mockGetBlogById).to.have.been.calledWithExactly('mockBlogId', 'mockUserId');
		});

		it('should return a error response if blogId is missing', async () => { // Case will not happen in a real scenario, but the check is there for safety
			await getBlogById(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.BAD_REQUEST);
			expect(mockRes.json).to.have.been.calledWithExactly({
				status: HttpStatus.BAD_REQUEST,
				success: false,
				message: 'Blog id is required.',
			});
			expect(mockGetBlogById).not.to.have.been.called;
		});

		it('should catch any thrown errors within the controller and return an error response', async () => {
			mockReq.params = { blogId: 'mockBlogId' };
			mockGetBlogById.rejects(new Error('mock error'));

			await getBlogById(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.INTERNAL_SERVER_ERROR);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'mock error',
			});
			expect(mockGetBlogById).to.have.been.calledWithExactly('mockBlogId', 'mockUserId');
		});
	});
});
