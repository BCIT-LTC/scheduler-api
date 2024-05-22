const { prisma } = require("@prisma/client");
const { createEvent, updateEvent } = require("../../models/events.js");

// Mocking the Prisma Client
jest.mock("@prisma/client", () => {
  const mockEvent = {
    event_id: 1,
    location_id: 1,
    start_time: "2023-08-01T08:00:00.000Z",
    end_time: "2023-08-01T15:00:00.000Z",
    event_name: 'Test Event',
    description: 'Test Description',
  };
  const mockPrisma = {
    event: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.event_id === 1) {
          return mockEvent;
        }
        return null;
      }),

    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
    prisma: mockPrisma,
  };
});

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

    expect(prisma.event.create).toHaveBeenCalledWith({
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
});

describe("createEvent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Enter custom DateTime
    const test_start_date = new Date("2023-08-01T08:00:00.000Z");
    const test_end_date = new Date("2023-08-01T15:00:00.000Z");

    it("creates an event and returns it with appropriate events model fields", async () => {
        const mockEvent = {
            location_id: 1,
            start_time: test_start_date,
            end_time: test_end_date,
            summary: "Test Event",
            description: "Test Description",
        };

        const expectedEvent = {
            location_id: 1,
            start_time: test_start_date,
            end_time: test_end_date,
            summary: "Test Event",
            description: "Test Description",
        };

        prisma.events.create.mockResolvedValue(expectedEvent);

        const event = await createEvent(mockEvent);

        expect(event).toEqual(expectedEvent);
        expect(prisma.events.create).toHaveBeenCalledTimes(1);
    });

  it("throws an error if location_id is null or undefined", async () => {
    const mockEvent = {
      start_time: test_start_date,
      end_time: test_end_date,
      summary: "Test Event",
      description: "Test Description",
    };

    await expect(createEvent(mockEvent)).rejects.toThrow();
  });

  it("throws an error if start_time is null or undefined", async () => {
    const mockEvent = {
      location_id: 1,
      end_time: test_end_date,
      summary: "Test Event",
      description: "Test Description",
    };

    await expect(createEvent(mockEvent)).rejects.toThrow();
  });

  it("throws an error if end_time is null or undefined", async () => {
    const mockEvent = {
      location_id: 1,
      start_time: test_start_date,
      summary: "Test Event",
      description: "Test Description",
    };

    await expect(createEvent(mockEvent)).rejects.toThrow();
  });

  it("throws an error if the event is null or undefined", async () => {
    prisma.events.create.mockResolvedValue(null);

    await expect(createEvent(null)).rejects.toThrow();
    await expect(createEvent(undefined)).rejects.toThrow();
  });
});


describe('updateEvent', () => {
  const mockEvent = {
    event_id: 1,
    location_id: 1,
    start_time: "2023-08-01T08:00:00.000Z",
    end_time: "2023-08-01T15:00:00.000Z",
    facilitator: 'Test Facilitator',
    description: 'Test Description',
    summary: "Test summary",
  };
  prisma.event.create.mockResolvedValue(mockEvent);
  it('updates an existing event and returns the updated event object', async () => {

    const updatedEvent = {
      ...mockEvent,
      start_time: "2023-08-02T09:00:00.000Z",
      end_time: "2023-08-02T16:00:00.000Z",
      facilitator: 'Updated Facilitator',
      description: 'Updated Description',
      summary: "Updated summary",
      modifier: {
        email: null
      },
    };
    prisma.event.update.mockResolvedValue(updatedEvent);

    const result = await updateEvent(updatedEvent);

    expect(prisma.event.update).toHaveBeenCalledWith({
      where: { event_id: mockEvent.event_id },
      data: {
        description: updatedEvent.description,
        start_time: updatedEvent.start_time,
        end_time: updatedEvent.end_time,
        facilitator: updatedEvent.facilitator,
        summary: updatedEvent.summary,
        location_id: {
          connect: {
            location_id: mockEvent.location_id,
          },
        },
        modifier: {
          connect: {
            email: mockEvent.modifier?.email,
          },
        },
        event_name: updatedEvent.event_name,
      },
    });
    expect(result).toEqual(updatedEvent);
  });

  it('throws an error if the event_id is null or undefined', async () => {
    const mockEvent = {
      location_id: 1,
      start_time: "2023-08-01T08:00:00.000Z",
      end_time: "2023-08-01T15:00:00.000Z",
      event_name: 'Test Event',
      description: 'Test Description',
    };

    await expect(updateEvent(mockEvent)).rejects.toThrow();
  });

  it('throws an error if the event does not exist', async () => {
    const mockEvent = {
      event_id: 2,
      location_id: 1,
      start_time: "2023-08-01T08:00:00.000Z",
      end_time: "2023-08-01T15:00:00.000Z",
      event_name: 'Test Event',
      description: 'Test Description',
    };
    prisma.event.update.mockResolvedValue(null);

    await expect(updateEvent(mockEvent)).rejects.toThrow();
  });
});

