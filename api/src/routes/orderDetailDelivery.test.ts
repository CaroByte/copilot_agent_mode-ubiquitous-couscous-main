import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderDetailDeliveryRouter, { resetOrderDetailDeliveries } from './orderDetailDelivery';
import { orderDetailDeliveries as seedOrderDetailDeliveries } from '../seedData';

let app: express.Express;

describe('OrderDetailDelivery API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/order-detail-deliveries', orderDetailDeliveryRouter);
        resetOrderDetailDeliveries();
    });

    it('should create a new order detail delivery', async () => {
        const newODD = {
            orderDetailDeliveryId: 100,
            orderDetailId: 1,
            deliveryId: 1,
            quantity: 10,
            notes: "Test delivery"
        };
        const response = await request(app).post('/order-detail-deliveries').send(newODD);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newODD);
    });

    it('should get all order detail deliveries', async () => {
        const response = await request(app).get('/order-detail-deliveries');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedOrderDetailDeliveries.length);
    });

    it('should get an order detail delivery by ID', async () => {
        const response = await request(app).get('/order-detail-deliveries/1');
        expect(response.status).toBe(200);
        expect(response.body.deliveryId).toBe(1);
    });

    it('should update an order detail delivery by ID', async () => {
        const updatedODD = {
            ...seedOrderDetailDeliveries[0],
            quantity: 50
        };
        const response = await request(app).put('/order-detail-deliveries/1').send(updatedODD);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedODD);
    });

    it('should delete an order detail delivery by ID', async () => {
        const response = await request(app).delete('/order-detail-deliveries/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing order detail delivery (GET)', async () => {
        const response = await request(app).get('/order-detail-deliveries/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 for non-existing order detail delivery (PUT)', async () => {
        const response = await request(app).put('/order-detail-deliveries/999').send({ quantity: 1 });
        expect(response.status).toBe(404);
    });

    it('should return 404 for non-existing order detail delivery (DELETE)', async () => {
        const response = await request(app).delete('/order-detail-deliveries/999');
        expect(response.status).toBe(404);
    });
});
