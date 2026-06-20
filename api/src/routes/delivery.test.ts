import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import deliveryRouter, { resetDeliveries } from './delivery';
import { deliveries as seedDeliveries } from '../seedData';

let app: express.Express;

describe('Delivery API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/deliveries', deliveryRouter);
        resetDeliveries();
    });

    it('should create a new delivery', async () => {
        const newDelivery = {
            deliveryId: 100,
            supplierId: 1,
            deliveryDate: new Date().toISOString(),
            name: "Test Delivery",
            description: "A test delivery",
            status: "pending"
        };
        const response = await request(app).post('/deliveries').send(newDelivery);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newDelivery);
    });

    it('should get all deliveries', async () => {
        const response = await request(app).get('/deliveries');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedDeliveries.length);
    });

    it('should get a delivery by ID', async () => {
        const response = await request(app).get('/deliveries/1');
        expect(response.status).toBe(200);
        expect(response.body.deliveryId).toBe(1);
    });

    it('should update a delivery by ID', async () => {
        const updatedDelivery = {
            ...seedDeliveries[0],
            name: 'Updated Delivery'
        };
        const response = await request(app).put('/deliveries/1').send(updatedDelivery);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedDelivery);
    });

    it('should update delivery status via PUT /:id/status', async () => {
        const response = await request(app)
            .put('/deliveries/1/status')
            .send({ status: 'delivered' });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('delivered');
    });

    it('should return 404 for PUT /:id/status on non-existing delivery', async () => {
        const response = await request(app)
            .put('/deliveries/999/status')
            .send({ status: 'delivered' });
        expect(response.status).toBe(404);
    });

    it('should delete a delivery by ID', async () => {
        const response = await request(app).delete('/deliveries/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing delivery (GET)', async () => {
        const response = await request(app).get('/deliveries/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 for non-existing delivery (PUT)', async () => {
        const response = await request(app).put('/deliveries/999').send({ name: 'x' });
        expect(response.status).toBe(404);
    });

    it('should return 404 for non-existing delivery (DELETE)', async () => {
        const response = await request(app).delete('/deliveries/999');
        expect(response.status).toBe(404);
    });
});
