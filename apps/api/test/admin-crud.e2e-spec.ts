import { execSync } from 'child_process';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

type UnknownRecord = Record<string, unknown>;

const ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3333';
const USER_AGENT = 'phase-a4-e2e-agent';
const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL ?? 'admin@ultramed.az';
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? 'admin123';

function randomSuffix(): string {
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function expectRecord(value: unknown): UnknownRecord {
  expect(isRecord(value)).toBe(true);
  return value as UnknownRecord;
}

function readStringField(payload: unknown, fieldName: string): string {
  const record = expectRecord(payload);
  const fieldValue = record[fieldName];
  expect(typeof fieldValue).toBe('string');
  return fieldValue as string;
}

function readNumberField(payload: unknown, fieldName: string): number {
  const record = expectRecord(payload);
  const fieldValue = record[fieldName];
  expect(typeof fieldValue).toBe('number');
  return fieldValue as number;
}

function readDetails(payload: unknown): UnknownRecord {
  const record = expectRecord(payload);
  return expectRecord(record.details);
}

function expectErrorContract(
  payload: unknown,
  expectedStatus: number,
  expectedCode?: string,
): void {
  const body = expectRecord(payload);
  expect(body.success).toBe(false);
  expect(body.statusCode).toBe(expectedStatus);
  expect(typeof body.code).toBe('string');
  expect(typeof body.message).toBe('string');
  expect(typeof body.timestamp).toBe('string');
  expect(typeof body.path).toBe('string');
  expect(typeof body.requestId).toBe('string');

  const nestedError = expectRecord(body.error);
  expect(typeof nestedError.code).toBe('string');
  expect(typeof nestedError.message).toBe('string');

  if (expectedCode) {
    expect(body.code).toBe(expectedCode);
    expect(nestedError.code).toBe(expectedCode);
  }
}

describe('Phase A/4 admin CRUD + error contract (e2e)', () => {
  let app: INestApplication<App>;
  let agent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    execSync('node ../../packages/database/prisma/seed.js', {
      stdio: 'pipe',
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();

    agent = request.agent(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns AUTH_REQUIRED contract for unauthenticated admin endpoint', async () => {
    const response = await request(app.getHttpServer())
      .get('/services/admin/all')
      .set('user-agent', USER_AGENT);

    expect(response.status).toBe(401);
    expectErrorContract(response.body as unknown, 401, 'AUTH_REQUIRED');
  });

  it('returns AUTH_INVALID_CREDENTIALS contract for invalid login', async () => {
    const response = await request(app.getHttpServer())
      .post('/admin/login')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        email: `invalid-${randomSuffix()}@example.com`,
        password: 'invalid-password-123',
      });

    expect(response.status).toBe(401);
    expectErrorContract(
      response.body as unknown,
      401,
      'AUTH_INVALID_CREDENTIALS',
    );
  });

  it('returns AUTH_LOGIN_RATE_LIMITED contract after repeated failed logins', async () => {
    const email = `rate-limit-${randomSuffix()}@example.com`;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await request(app.getHttpServer())
        .post('/admin/login')
        .set('origin', ORIGIN)
        .set('user-agent', USER_AGENT)
        .send({
          email,
          password: 'invalid-password-123',
        });
    }

    const response = await request(app.getHttpServer())
      .post('/admin/login')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        email,
        password: 'invalid-password-123',
      });

    expect(response.status).toBe(429);
    expectErrorContract(
      response.body as unknown,
      429,
      'AUTH_LOGIN_RATE_LIMITED',
    );

    const details = readDetails(response.body as unknown);
    expect(typeof details.retryAfterSeconds).toBe('number');
  });

  it('logs in seeded admin and sets session cookie', async () => {
    const response = await agent
      .post('/admin/login')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

    expect(response.status).toBe(200);
    const body = expectRecord(response.body as unknown);
    expect(body.success).toBe(true);

    const admin = expectRecord(body.admin);
    expect(typeof admin.id).toBe('string');
    expect(admin.email).toBe(ADMIN_EMAIL);
    expect(typeof body.expiresAt).toBe('string');

    const headers = response.headers as Record<string, unknown>;
    const setCookieHeader = headers['set-cookie'];
    expect(Array.isArray(setCookieHeader)).toBe(true);
    if (Array.isArray(setCookieHeader)) {
      expect(
        setCookieHeader.some(
          (cookie) =>
            typeof cookie === 'string' &&
            cookie.includes('ultramed_admin_token='),
        ),
      ).toBe(true);
    }
  });

  it('returns VALIDATION_ERROR contract for malformed service payload', async () => {
    const response = await agent
      .post('/services')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({});

    expect(response.status).toBe(400);
    expectErrorContract(response.body as unknown, 400, 'VALIDATION_ERROR');
  });

  it('supports CRUD smoke for /services', async () => {
    const suffix = randomSuffix();
    const createResponse = await agent
      .post('/services')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        titleAz: `Service ${suffix}`,
        summaryAz: `Summary ${suffix}`,
        contentAz: `Content ${suffix}`,
        highlightsAz: ['Highlight 1', 'Highlight 2'],
      });

    expect(createResponse.status).toBe(201);
    const serviceId = readStringField(createResponse.body as unknown, 'id');

    const updateResponse = await agent
      .put(`/services/${serviceId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        titleAz: `Service updated ${suffix}`,
      });

    expect(updateResponse.status).toBe(200);
    expect(readStringField(updateResponse.body as unknown, 'titleAz')).toBe(
      `Service updated ${suffix}`,
    );

    const deleteResponse = await agent
      .delete(`/services/${serviceId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT);

    expect(deleteResponse.status).toBe(200);
    expect(readStringField(deleteResponse.body as unknown, 'id')).toBe(
      serviceId,
    );
  });

  it('supports CRUD smoke for /doctors', async () => {
    const suffix = randomSuffix();
    const createResponse = await agent
      .post('/doctors')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        name: `Doctor ${suffix}`,
        specialty: 'Cardiology',
        titleAz: `Doctor title ${suffix}`,
        bioAz: `Doctor bio ${suffix}`,
      });

    expect(createResponse.status).toBe(201);
    const doctorId = readStringField(createResponse.body as unknown, 'id');

    const updateResponse = await agent
      .put(`/doctors/${doctorId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        experience: '10 il',
      });

    expect(updateResponse.status).toBe(200);
    expect(readStringField(updateResponse.body as unknown, 'experience')).toBe(
      '10 il',
    );

    const deleteResponse = await agent
      .delete(`/doctors/${doctorId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT);

    expect(deleteResponse.status).toBe(200);
    expect(readStringField(deleteResponse.body as unknown, 'id')).toBe(
      doctorId,
    );
  });

  it('supports CRUD smoke for /blog', async () => {
    const suffix = randomSuffix();
    const createResponse = await agent
      .post('/blog')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        titleAz: `Blog ${suffix}`,
        contentAz: `Blog content ${suffix}`,
      });

    expect(createResponse.status).toBe(201);
    const blogId = readStringField(createResponse.body as unknown, 'id');

    const updateResponse = await agent
      .put(`/blog/${blogId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        featured: true,
        published: true,
      });

    expect(updateResponse.status).toBe(200);
    const body = expectRecord(updateResponse.body as unknown);
    expect(body.featured).toBe(true);
    expect(body.published).toBe(true);

    const deleteResponse = await agent
      .delete(`/blog/${blogId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT);

    expect(deleteResponse.status).toBe(200);
    expect(readStringField(deleteResponse.body as unknown, 'id')).toBe(blogId);
  });

  it('supports CRUD smoke for /faq', async () => {
    const suffix = randomSuffix();
    const createResponse = await agent
      .post('/faq')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        questionAz: `Sual ${suffix}`,
        answerAz: `Cavab ${suffix}`,
      });

    expect(createResponse.status).toBe(201);
    const faqId = readStringField(createResponse.body as unknown, 'id');

    const updateResponse = await agent
      .put(`/faq/${faqId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        answerAz: `Cavab updated ${suffix}`,
      });

    expect(updateResponse.status).toBe(200);
    expect(readStringField(updateResponse.body as unknown, 'answerAz')).toBe(
      `Cavab updated ${suffix}`,
    );

    const deleteResponse = await agent
      .delete(`/faq/${faqId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT);

    expect(deleteResponse.status).toBe(200);
    expect(readStringField(deleteResponse.body as unknown, 'id')).toBe(faqId);
  });

  it('supports CRUD smoke for /gallery', async () => {
    const suffix = randomSuffix();
    const createResponse = await agent
      .post('/gallery')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        imageUrl: `https://example.com/gallery-${suffix}.jpg`,
        captionAz: `Sekil ${suffix}`,
      });

    expect(createResponse.status).toBe(201);
    const galleryId = readStringField(createResponse.body as unknown, 'id');

    const updateResponse = await agent
      .put(`/gallery/${galleryId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        captionAz: `Sekil updated ${suffix}`,
      });

    expect(updateResponse.status).toBe(200);
    expect(readStringField(updateResponse.body as unknown, 'captionAz')).toBe(
      `Sekil updated ${suffix}`,
    );

    const deleteResponse = await agent
      .delete(`/gallery/${galleryId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT);

    expect(deleteResponse.status).toBe(200);
    expect(readStringField(deleteResponse.body as unknown, 'id')).toBe(
      galleryId,
    );
  });

  it('supports CRUD smoke for /content/testimonials', async () => {
    const suffix = randomSuffix();
    const createResponse = await agent
      .post('/content/testimonials')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        name: `Pasiyent ${suffix}`,
        commentAz: `Rey ${suffix}`,
        rating: 5,
      });

    expect(createResponse.status).toBe(201);
    const testimonialId = readStringField(createResponse.body as unknown, 'id');

    const updateResponse = await agent
      .put(`/content/testimonials/${testimonialId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        rating: 4,
      });

    expect(updateResponse.status).toBe(200);
    expect(readNumberField(updateResponse.body as unknown, 'rating')).toBe(4);

    const deleteResponse = await agent
      .delete(`/content/testimonials/${testimonialId}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT);

    expect(deleteResponse.status).toBe(200);
    expect(readStringField(deleteResponse.body as unknown, 'id')).toBe(
      testimonialId,
    );
  });

  it('supports CRUD smoke for /content/pages', async () => {
    const suffix = randomSuffix();
    const slug = `phase-a4-page-${suffix}`;

    const createResponse = await agent
      .post('/content/pages')
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        slug,
        titleAz: `Title ${suffix}`,
        descriptionAz: `Description ${suffix}`,
        sectionsAz: [{ title: 'Section', content: 'Content' }],
      });

    expect(createResponse.status).toBe(201);
    expect(readStringField(createResponse.body as unknown, 'slug')).toBe(slug);

    const updateResponse = await agent
      .put(`/content/pages/${slug}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT)
      .send({
        titleAz: `Updated title ${suffix}`,
      });

    expect(updateResponse.status).toBe(200);
    expect(readStringField(updateResponse.body as unknown, 'titleAz')).toBe(
      `Updated title ${suffix}`,
    );

    const deleteResponse = await agent
      .delete(`/content/pages/${slug}`)
      .set('origin', ORIGIN)
      .set('user-agent', USER_AGENT);

    expect(deleteResponse.status).toBe(200);
    expect(readStringField(deleteResponse.body as unknown, 'slug')).toBe(slug);
  });
});
