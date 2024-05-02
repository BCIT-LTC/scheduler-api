// Mocking the Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        events: {
            create: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
        prisma: mockPrisma,
    };
});

const { prisma } = require("@prisma/client");
const { createEvent } = require('../../models/events.js');

describe('createEvent', () => {
    it('creates an event and returns it with appropriate events model fields', async () => {
        const mockEvent = {
            location_id: 1,
            start_time: "2023-08-01T08:00:00.000Z",
            end_time: "2023-08-01T15:00:00.000Z",
            event_name: 'Test Event',
            description: 'Test Description',
        };
        const mockCreatedEvent = { ...mockEvent, event_id: 1 };
        prisma.event.create.mockResolvedValue(mockCreatedEvent);

        const result = await createEvent(mockEvent);

        expect(prisma.events.create).toHaveBeenCalledWith({
        data: {
            location_id: mockEvent.location_id,
            start_time: mockEvent.start_time,
            end_time: mockEvent.end_time,
            summary: mockEvent.event_name,
            description: mockEvent.description,
        },
        });
        expect(result).toEqual(mockCreatedEvent);
    });

    it('throws an error if location_id is null or undefined', async () => {
        const mockEvent = {
            start_time: "2023-08-01T08:00:00.000Z",
            end_time: "2023-08-01T15:00:00.000Z",
            event_name: 'Test Event',
            description: 'Test Description',
        };

        await expect(createEvent(mockEvent)).rejects.toThrow();
    });

    it('throws an error if start_time is null or undefined', async () => {
        const mockEvent = {
            location_id: 1,
            end_time: "2023-08-01T15:00:00.000Z",
            event_name: 'Test Event',
            description: 'Test Description',
        };

        await expect(createEvent(mockEvent)).rejects.toThrow();
    });

    it('throws an error if end_time is null or undefined', async () => {
        const mockEvent = {
            location_id: 1,
            start_time: "2023-08-01T08:00:00.000Z",
            event_name: 'Test Event',
            description: 'Test Description',
        };

        await expect(createEvent(mockEvent)).rejects.toThrow();
    });

    it("throws an error if the event is null or undefined", async () => {
        prisma.event.create.mockResolvedValue(null);

        await expect(createEvent(null)).rejects.toThrow();
        await expect(createEvent(undefined)).rejects.toThrow();
    });
});