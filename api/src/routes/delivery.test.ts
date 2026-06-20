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

    it('should get all deliveries', async () => {
        const response = await request(app).get('/deliveries');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedDeliveries.length);
        response.body.forEach((delivery: any, index: number) => {
            expect(delivery).toMatchObject(seedDeliveries[index]);
        });
    });

    it('should get a delivery by ID', async () => {
        const response = await request(app).get('/deliveries/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedDeliveries[0]);
    });

    it('should return 404 for non-existing delivery (GET)', async () => {
        const response = await request(app).get('/deliveries/999');
        expect(response.status).toBe(404);
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

    it('should update a delivery by ID', async () => {
        const updatedDelivery = {
            ...seedDeliveries[0],
            name: 'Updated Delivery'
        };
        const response = await request(app).put('/deliveries/1').send(updatedDelivery);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedDelivery);
    });

    it('should return 404 for updating non-existing delivery', async () => {
        const response = await request(app).put('/deliveries/999').send({ name: 'Ghost' });
        expect(response.status).toBe(404);
    });

    it('should update delivery status via PUT /:id/status', async () => {
        const response = await request(app)
            .put('/deliveries/1/status')
            .send({ status: 'delivered' });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('delivered');
    });

    it('should return 404 for status update on non-existing delivery', async () => {
        const response = await request(app)
            .put('/deliveries/999/status')
            .send({ status: 'delivered' });
        expect(response.status).toBe(404);
    });

    it('should delete a delivery by ID', async () => {
        const response = await request(app).delete('/deliveries/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for deleting non-existing delivery', async () => {
        const response = await request(app).delete('/deliveries/999');
        expect(response.status).toBe(404);
    });
});
