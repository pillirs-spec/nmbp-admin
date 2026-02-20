import request from 'supertest';
import { STATUS_CODES } from 'http';
import app from "../main/app";
import { expect } from 'chai';

describe('GET /api/v1/user/health', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/api/v1/user/health');
    expect(res.status).to(STATUS_CODES.OK);
  });
});