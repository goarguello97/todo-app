import request from "supertest";
import app from "../app";
import prisma from "../prisma";

const api = "/api";

xdescribe("CRUD de tareas", () => {
  let taskId: string;
  let userId: string;
  let token: string;

  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    const uniqueEmail = `Joe+crud${Date.now()}@test.com`;

    const user = await request(app).post("/api/users").send({
      name: "Joe",
      email: uniqueEmail,
      password: "Test-12345",
    });

    const login = await request(app).post("/api/auth/login").send({
      email: uniqueEmail,
      password: "Test-12345",
    });

    userId = user.body.data.id;
    token = login.body.data.token;

    const res = await request(app)
      .post(`${api}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        task: "Esta es una tarea para testear.",
        userId,
      });

    taskId = res.body.data.id;
  });

  it("GET /tasks debería retornar un array con una tarea.", async () => {
    const res = await request(app)
      .get(`${api}/tasks`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Tareas obtenidas correctamente."
    );
    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("total", 1);
    expect(res.body.meta).toHaveProperty("path", "/api/tasks");

    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: taskId,
          task: "Esta es una tarea para testear.",
          userId,
        }),
      ])
    );
  });

  it("GET /tasks/:id debería retornar la tarea existente", async () => {
    const res = await request(app)
      .get(`${api}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Tarea encontrada.");

    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        task: "Esta es una tarea para testear.",
        userId,
      })
    );

    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/tasks/${taskId}`,
      })
    );
  });

  it("PUT /tasks/:id debería actualizar la tarea correctamente", async () => {
    const data = { task: "Esta es una tarea modificada." };

    const res = await request(app)
      .put(`${api}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(data);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Tarea modificada correctamente."
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: taskId,
        task: "Esta es una tarea modificada.",
        userId,
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");
    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/tasks/${taskId}`,
      })
    );
  });

  it("DELETE /tasks/:id debería eliminar la tarea correctamente", async () => {
    const res = await request(app)
      .delete(`${api}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Tarea eliminada correctamente."
    );
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: taskId,
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/tasks/${taskId}`,
      })
    );
  });
});

describe("Rutas de Task", () => {
  let token: string;
  let userId: string;
  const uniqueEmail = `Joe+crud${Date.now()}@test.com`;

  beforeAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});

    const user = await request(app).post("/api/users").send({
      name: "Joe",
      email: uniqueEmail,
      password: "Test-12345",
    });

    const login = await request(app).post("/api/auth/login").send({
      email: uniqueEmail,
      password: "Test-12345",
    });

    userId = user.body.data.id;
    token = login.body.data.token;
  });

  it("GET /tasks debería fallar sin token", async () => {
    const res = await request(app).get(`${api}/tasks`);

    expect(res.status).toBe(401);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Token no proporcionado.");
    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/tasks",
      })
    );
  });

  it("GET /tasks debería retornar un array de tareas vacío.", async () => {
    const res = await request(app)
      .get(`${api}/tasks`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Tareas obtenidas correctamente."
    );
    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("total", 0);
    expect(res.body.meta).toHaveProperty("path", "/api/tasks");

    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("POST /tasks debería fallar si falta el campo task", async () => {
    const data = {
      userId,
    };

    const res = await request(app)
      .post(`${api}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send(data);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "task",
          message: "La tarea es requerida.",
        }),
        expect.objectContaining({
          field: "task",
          message: "Mínimo 10 caracteres y maximo 100 caracteres.",
        }),
      ])
    );

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/tasks",
      })
    );
  });

  it("POST /tasks debería fallar si falta el campo userId", async () => {
    const data = {
      task: "Esta es una tarea para testear.",
    };

    const res = await request(app)
      .post(`${api}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send(data);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "userId",
          message: "Ingrese un ID de usuario válido.",
        }),
      ])
    );

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/tasks",
      })
    );
  });

  it("POST /tasks debería fallar si el usuario no existe", async () => {
    const data = {
      task: "Esta es una tarea para testear.",
      userId: "00000000-0000-0000-0000-000000000000",
    };

    const res = await request(app)
      .post(`${api}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send(data);

    expect(res.status).toBe(404);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Usuario no encontrado.");
    expect(res.body).toHaveProperty("data", null);

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/tasks",
      })
    );
  });

  it("POST /tasks debería crear una tarea correctamente", async () => {
    const data = {
      task: "Esta es una tarea para testear.",
      userId,
    };

    const res = await request(app)
      .post(`${api}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send(data);

    expect(res.status).toBe(201);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Tarea creada correctamente.");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        task: "Esta es una tarea para testear.",
        userId,
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");
    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/tasks",
      })
    );
  });

  it("GET /tasks/:id debería retornar 404 si no existe la tarea", async () => {
    const res = await request(app)
      .get(`${api}/tasks/00000000-0000-0000-0000-000000000000`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Tarea no encontrada.");
    expect(res.body).toHaveProperty("data", null);
    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/tasks/00000000-0000-0000-0000-000000000000",
      })
    );
  });

  it("PUT /tasks/:id debería retornar 404 si no existe la tarea", async () => {
    const data = { task: "Esta es una tarea modificada." };
    const res = await request(app)
      .put(`${api}/tasks/00000000-0000-0000-0000-000000000000`)
      .set("Authorization", `Bearer ${token}`)
      .send(data);

    expect(res.status).toBe(404);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Tarea no encontrada.");
    expect(res.body).toHaveProperty("data", null);
    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/tasks/00000000-0000-0000-0000-000000000000",
      })
    );
  });

  it("DELETE /tasks/:id debería retornar 404 si no existe la tarea", async () => {
    const res = await request(app)
      .delete(`${api}/tasks/00000000-0000-0000-0000-000000000000`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Tarea no encontrada.");
    expect(res.body).toHaveProperty("data", null);
    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/tasks/00000000-0000-0000-0000-000000000000",
      })
    );
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
