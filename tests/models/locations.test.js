jest.mock('@prisma/client', () => {
    const mockPrisma = {
        location: {
            create: jest.fn(),
        },
    };

    return {
        PrismaClient: jest.fn(() => mockPrisma),
        prisma: mockPrisma,
    };
});

const { prisma } = require("@prisma/client");
const { createLocation } = require('../../models/locations.js');

describe('createLocation', () => {
    const mockLocation = {
        room_location: "NW4-3241",
        modified_by: "admin@bcit.ca",
    };

    it('creates a location and returns it with appropriate location model fields', async () => {
        prisma.location.create.mockResolvedValue(mockLocation);
        const result = await createLocation(mockLocation.room_location, mockLocation.modified_by);
    
        expect(prisma.location.create).toHaveBeenCalledWith({
            data: {
                room_location: mockLocation.room_location,
                modifier: { connect: { email: mockLocation.modified_by } },
            },
        });

        expect(result).toEqual(mockLocation)
    });

    it('throws an error if room_location is undefined', async () => {
        await expect(createLocation(
            mockLocation.modified_by
        )).rejects.toThrow("Missing required fields");
    });

    
    it('throws an error if modified_by is undefined', async () => {
        await expect(createLocation(
            mockLocation.room_location, 
        )).rejects.toThrow("Missing required fields");
    });

    // Test not working because no relation to db
    // it('throws an error if room_location already exists', async () => {
    //     await createLocation(
    //         mockLocation.room_location,
    //         mockLocation.modified_by
    //     );
    
    //     await expect(createLocation(
    //         mockLocation.room_location,
    //         mockLocation.modified_by
    //     )).rejects.toThrow('Location already exists');
    // });


});