import express from 'express';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Application from '../application';

chai.use(chaiHttp);

let application: Application;
let server: express.Application;

describe('API Tests', () => {
  before(async () => {
    application = new Application();
    await application.connectDB();
    await application.init();

    server = application.app;
  });

  it('should create shortURL successfully', async () => {
    const res = await chai.request(server).get('/graphiql').send({
      query: `query {
				shortenURL(url: "http://google.com")	
				}`,
    });

    expect(res.status).to.eq(200);
  });
  it('should not accept invalid url', async () => {
    const res = await chai.request(server).get('/graphiql').send({
      query: `query {
				shortenURL(url: "google.com")	
				}`,
    });

    expect(res.body.data.shortenURL).to.eq('Invalid url');
  });
});
