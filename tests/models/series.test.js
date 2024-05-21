// Mocking the Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        series: {
            create: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
        prisma: mockPrisma,
    };
});

const { prisma } = require("@prisma/client");
const { createSeries } = require('../../models/series.js');

describe('createSeries', () => {
    it('creates a series and returns it with appropriate series model fields', async () => {
        const mockSeries = {
            series_title: "Test Series",
            description: "Test Series Description",
            facilitator: "Test Facilitator",
            start_time: "2024-06-01T09:00:00Z",
            end_time: "2024-06-01T11:00:00Z",
            start_date: "2024-06-01T00:00:00.000Z",
            end_date: "2024-08-01T00:00:00.000Z",
            status: "TENTATIVE",
            recurrence_frequency_weeks: 4,
            recurrence_frequency_days: [0, 3, 5],
            events: []
        };
        const mockCreatedSeries = { ...mockSeries, series_id: 1 };
        prisma.series.create.mockResolvedValue(mockCreatedSeries);
        
        const result = await createSeries(mockSeries);

        expect(prisma.series.create).toHaveBeenCalledWith({
            data: {
                series_title: mockSeries.series_title,
                description: mockSeries.description,
                facilitator: mockSeries.facilitator,
                start_time: new Date(mockSeries.start_time),
                end_time: new Date(mockSeries.end_time),
                start_date: new Date(mockSeries.start_date),
                end_date: new Date(mockSeries.end_date),
                status: mockSeries.status,
                recurrence_frequency_weeks: mockSeries.recurrence_frequency_weeks,
                recurrence_frequency_days: mockSeries.recurrence_frequency_days,
                events: {
                    connect: []
                }
            },
        });
        expect(result).toEqual(mockCreatedSeries);
    });

    it('throws an error if start_time is null or undefined', async () => {
        const mockSeries = {
            series_id: 1,
            end_time: "2023-08-01T15:00:00.000Z",
            series_title: 'Test Series',
            description: 'Test Description',
        };

        await expect(createSeries(mockSeries)).rejects.toThrow();
    });

    it('throws an error if end_time is null or undefined', async () => {
        const mockSeries = {
            series_id: 1,
            start_time: "2024-06-01T09:00:00Z",
            series_title: 'Test Title',
            description: 'Test Description',
        };

        await expect(createSeries(mockSeries)).rejects.toThrow();
    });

    it('throws an error if start_date is null or undefined', async () => {
        const mockSeries = {
            start_time: "2024-06-01T09:00:00Z",
            end_time: "2023-08-01T15:00:00.000Z",
            end_date: "2024-08-01",
            series_title: 'Test Series',
            description: 'Test Description',
        };

        await expect(createSeries(mockSeries)).rejects.toThrow();
    });

    it('throws an error if end_date is null or undefined', async () => {
        const mockSeries = {
            start_time: "2024-06-01T09:00:00Z",
            end_time: "2023-08-01T15:00:00.000Z",
            start_date: "2024-06-01",
            series_title: 'Test Series',
            description: 'Test Description',
        };

        await expect(createSeries(mockSeries)).rejects.toThrow();
    });

    it("throws an error if the series is null or undefined", async () => {
        prisma.series.create.mockResolvedValue(null);

        await expect(createSeries(null)).rejects.toThrow();
        await expect(createSeries(undefined)).rejects.toThrow();
    });
});



