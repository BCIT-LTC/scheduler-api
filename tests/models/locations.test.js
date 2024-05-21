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
const { createLocation, deleteLocation } = require('../../models/locations.js');

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

describe('deleteLocation', () => {
    it('deletes a location from the database', async () => {
        const mockLocationId = 1;
        prisma.location.delete.mockResolvedValue(mockLocationId);

        const result = await deleteLocation(mockLocationId);

        expect(prisma.location.delete).toHaveBeenCalledWith({
            where: { id: mockLocationId },
        });

        expect(result).toEqual(mockLocationId);
    });

    it('throws an error if location_id does not exist', async () => {
        await expect(deleteLocation()).rejects.toThrow();
    });
});