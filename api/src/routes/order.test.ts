import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderRouter, { resetOrders } from './order';
import { orders as seedOrders } from '../seedData';

let app: express.Express;

describe('Order API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/orders', orderRouter);
        resetOrders();
    });

    it('should get all orders', async () => {
        const response = await request(app).get('/orders');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedOrders.length);
        response.body.forEach((order: any, index: number) => {
            expect(order).toMatchObject(seedOrders[index]);
        });
    });

    it('should get an order by ID', async () => {
        const response = await request(app).get('/orders/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedOrders[0]);
    });

    it('should return 404 for non-existing order', async () => {
        const response = await request(app).get('/orders/999');
        expect(response.status).toBe(404);
    });

    it('should create a new order', async () => {
        const newOrder = {
            orderId: 100,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: "Test Order",
            description: "A test order",
            status: "pending"
        };
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newOrder);
    });

    it('should update an order by ID', async () => {
        const updatedOrder = {
            ...seedOrders[0],
            name: 'Updated Order'
        };
        const response = await request(app).put('/orders/1').send(updatedOrder);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedOrder);
    });

    it('should return 404 when updating non-existing order', async () => {
        const response = await request(app).put('/orders/999').send({ name: 'No Order' });
        expect(response.status).toBe(404);
    });

    it('should delete an order by ID', async () => {
        const response = await request(app).delete('/orders/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 when deleting non-existing order', async () => {
        const response = await request(app).delete('/orders/999');
        expect(response.status).toBe(404);
    });
});
