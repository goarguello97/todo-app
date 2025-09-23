import request from "supertest";
import app from "../app";
import prisma from "../prisma";

const api = "/api";

xdescribe("Rutas auth", () => {
  let user;

  beforeAll(async () => {
    await prisma.user.deleteMany({});
    user = await prisma.user.create({
      data: {
        name: "Gonzalo",
        email: "gonzalo@test.com",
        password:
          "$2b$10$X5nmQPuhwyIom8p8sqlrk.W.UBYyUQBPHSGPbyU7tfCSV1j80v3xe",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        Task: true,
      },
    });
  });

  it("POST /login deberia tener acceso con credenciales válidas.", async () => {
    const res = await request(app).post(`${api}/auth/login`).send({
      email: "gonzalo@test.com",
      password: "Gonza-12345",
    });

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Inicio de sesión exitoso.");

    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String),
          name: "Gonzalo",
          email: "gonzalo@test.com",
        }),
        token: expect.any(String),
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", "/api/auth/login");
  });

  it("POST /login no deberia tener acceso con email inválido.", async () => {
    const res = await request(app).post(`${api}/auth/login`).send({
      email: "gonzaloo@test.com",
      password: "Gonza-12345",
    });

    expect(res.status).toBe(401);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario o contraseña incorrectos."
    );

    expect(res.body).toHaveProperty("data", null);

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", "/api/auth/login");
  });

  it("POST /login no deberia tener acceso con contraseña inválida.", async () => {
    const res = await request(app).post(`${api}/auth/login`).send({
      email: "gonzalo@test.com",
      password: "Gonza-1234",
    });

    expect(res.status).toBe(401);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario o contraseña incorrectos."
    );

    expect(res.body).toHaveProperty("data", null);

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", "/api/auth/login");
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });
});
