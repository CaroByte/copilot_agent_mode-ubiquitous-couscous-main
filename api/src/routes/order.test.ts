import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderRouter from './order';

let app: express.Express;

describe('Order API - Checkout', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/orders', orderRouter);
    });

    it('should create a new order for checkout', async () => {
        const newOrder = {
            orderId: Date.now(),
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: 'Customer Order',
            description: 'Order with 2 product(s)',
            status: 'pending'
        };
        
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            orderId: newOrder.orderId,
            branchId: 1,
            name: 'Customer Order',
            status: 'pending'
        });
    });

    it('should get all orders including newly created ones', async () => {
        const newOrder = {
            orderId: Date.now(),
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: 'Test Order',
            description: 'Test order from checkout',
            status: 'pending'
        };
        
        await request(app).post('/orders').send(newOrder);
        const response = await request(app).get('/orders');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.some((order: any) => order.orderId === newOrder.orderId)).toBe(true);
    });

    it('should get a specific order by ID', async () => {
        const newOrder = {
            orderId: 999888,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: 'Specific Order',
            description: 'Order for retrieval test',
            status: 'pending'
        };
        
        await request(app).post('/orders').send(newOrder);
        const response = await request(app).get('/orders/999888');
        
        expect(response.status).toBe(200);
        expect(response.body.orderId).toBe(999888);
        expect(response.body.name).toBe('Specific Order');
    });
});
