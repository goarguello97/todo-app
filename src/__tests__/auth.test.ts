import request from "supertest";
import app from "../app";
import prisma from "../prisma";

const api = "/api";

describe("Rutas auth", () => {
  let userEmail;

  beforeAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});

    const uniqueEmail = `Joe+crud${Date.now()}@test.com`;

    const user = await request(app).post("/api/users").send({
      name: "Joe",
      email: uniqueEmail,
      password: "Test-12345",
    });

    userEmail = user.body.data.email;
  });

  it("POST /login deberia tener acceso con credenciales válidas.", async () => {
    const res = await request(app).post(`${api}/auth/login`).send({
      email: userEmail,
      password: "Test-12345",
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
          name: "Joe",
          email: userEmail,
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
      email: "John@test.com",
      password: "Test-12345",
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
      email: userEmail,
      password: "Test-1234",
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
});

afterAll(async () => {
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});
