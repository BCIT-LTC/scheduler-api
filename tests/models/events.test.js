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



const {
  getEventsByDate,
  getEventsByMonth,
  getEventsByWeek,
  getEventsByRange,
} = require("../../models/events.js");

describe("getEventsByDate", () => {
  it("returns events for the specified date", async () => {
    const mockEvents = [{ event_id: 1 }, { event_id: 2 }];
    prisma.event.findMany.mockResolvedValue(mockEvents);

    const result = await getEventsByDate(new Date("2024-01-01"));

    expect(result).toEqual(mockEvents);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        start_time: {
          gte: new Date("2024-01-01"),
        },
        end_time: {
          lt: new Date("2024-01-02"),
        },
      },
    });
  });

  it("returns an empty array when there are no events for the specified date", async () => {
    prisma.event.findMany.mockResolvedValue([]);

    const result = await getEventsByDate(new Date("2024-01-01"));

    expect(result).toEqual([]);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        start_time: {
          gte: new Date("2024-01-01"),
        },
        end_time: {
          lt: new Date("2024-01-02"),
        },
      },
    });
  });

  it("returns undefined when the database query fails", async () => {
    prisma.event.findMany.mockImplementation(() => {
      throw new Error("Database error");
    });

    const result = await getEventsByDate(new Date("2024-01-01"));

    expect(result).toBeUndefined();
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        start_time: {
          gte: new Date("2024-01-01"),
        },
        end_time: {
          lt: new Date("2024-01-02"),
        },
      },
    });
  });
});

describe("getEventsByMonth", () => {
  it("returns events for the specified month", async () => {
    const mockEvents = [{ event_id: 1 }, { event_id: 2 }];
    prisma.event.findMany.mockResolvedValue(mockEvents);

    const date = new Date("2024-01-15");
    const lowerBound = new Date(date);
    lowerBound.setDate(date.getDate() - 15);
    const upperBound = new Date(date);
    upperBound.setDate(date.getDate() + 15);

    const result = await getEventsByMonth(date);

    expect(result).toEqual(mockEvents);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        start_time: {
          gte: lowerBound,
          lte: upperBound,
        },
      },
    });
  });

  it("returns an empty array when there are no events for the specified month", async () => {
    prisma.event.findMany.mockResolvedValue([]);

    const date = new Date("2024-01-15");
    let lowerBound = new Date(date);
    lowerBound.setDate(date.getDate() - 15);
    let upperBound = new Date(date);
    upperBound.setDate(date.getDate() + 15);

    const result = await getEventsByMonth(date);

    expect(result).toEqual([]);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        start_time: {
          gte: lowerBound,
          lte: upperBound,
        },
      },
    });
  });

  it("returns undefined when the database query fails", async () => {
    prisma.event.findMany.mockImplementation(() => {
      throw new Error("Database error");
    });

    const date = new Date("2024-01-15");
    let lowerBound = new Date(date);
    lowerBound.setDate(date.getDate() - 15);
    let upperBound = new Date(date);
    upperBound.setDate(date.getDate() + 15);

    const result = await getEventsByMonth(date);

    expect(result).toBeUndefined();
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        start_time: {
          gte: lowerBound,
          lte: upperBound,
        },
      },
    });
  });
});

describe("getEventsByWeek", () => {
  it("returns events for the specified week", async () => {
    const mockEvents = [{ event_id: 1 }, { event_id: 2 }];
    prisma.event.findMany.mockResolvedValue(mockEvents);

    const date = new Date("2024-01-15");
    let lowerBound = new Date(date);
    lowerBound.setDate(date.getDate() - 4);
    let upperBound = new Date(date);
    upperBound.setDate(date.getDate() + 5);

    const result = await getEventsByWeek(date);

    expect(result).toEqual(mockEvents);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        start_time: {
          gte: lowerBound,
          lte: upperBound,
        },
      },
    });
  });

  it("returns an empty array when there are no events for the specified week", async () => {
    prisma.event.findMany.mockResolvedValue([]);

    const date = new Date("2024-01-15");
    let lowerBound = new Date(date);
    lowerBound.setDate(date.getDate() - 4);
    let upperBound = new Date(date);
    upperBound.setDate(date.getDate() + 5);

    const result = await getEventsByWeek(date);

    expect(result).toEqual([]);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        start_time: {
          gte: lowerBound,
          lte: upperBound,
        },
      },
    });
  });

  it("returns undefined when the database query fails", async () => {
    prisma.event.findMany.mockImplementation(() => {
      throw new Error("Database error");
    });

    const date = new Date("2024-01-15");
    let lowerBound = new Date(date);
    lowerBound.setDate(date.getDate() - 4);
    let upperBound = new Date(date);
    upperBound.setDate(date.getDate() + 5);

    const result = await getEventsByWeek(date);

    expect(result).toBeUndefined();
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        start_time: {
          gte: lowerBound,
          lte: upperBound,
        },
      },
    });
  });
});

describe("getEventsByRange", () => {
  it("returns events for the specified range", async () => {
    const mockEvents = [{ event_id: 1 }, { event_id: 2 }];
    prisma.event.findMany.mockResolvedValue(mockEvents);

    const result = await getEventsByRange(
      new Date("2024-01-01"),
      new Date("2024-01-31")
    );

    expect(result).toEqual(mockEvents);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        start_time: {
          gte: new Date("2024-01-01"),
        },
        end_time: {
          lt: new Date("2024-01-31"),
        },
      },
    });
  });

  it("throws an error when the date format is invalid", async () => {
    await expect(
      getEventsByRange("invalid date", "2024-01-31")
    ).rejects.toThrow("Invalid date format");
    await expect(
      getEventsByRange("2024-01-01", "invalid date")
    ).rejects.toThrow("Invalid date format");
  });

  it("returns undefined when the database query fails", async () => {
    prisma.event.findMany.mockImplementation(() => {
      throw new Error("Database error");
    });

    const result = await getEventsByRange(
      new Date("2024-01-01"),
      new Date("2024-01-31")
    );

    expect(result).toBeUndefined();
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

