import request from "supertest";
import app from "../app";
import prisma from "../prisma";

const api = "/api";

describe("Rutas de usuario", () => {
  let token: string;

  beforeAll(async () => {
    await prisma.user.deleteMany({});

    // Creamos usuarios de prueba

    await prisma.user.createMany({
      data: [
        {
          name: "Gonzalo",
          email: "gonzalo@test.com",
          password:
            "$2b$10$X5nmQPuhwyIom8p8sqlrk.W.UBYyUQBPHSGPbyU7tfCSV1j80v3xe",
        },
        {
          name: "Lucía",
          email: "lucia@test.com",
          password:
            "$2b$10$X5nmQPuhwyIom8p8sqlrk.W.UBYyUQBPHSGPbyU7tfCSV1j80v3xe",
        },
      ],
    });

    // Logueamos un usuario para obtener el token
    const res = await request(app).post(`${api}/auth/login`).send({
      email: "gonzalo@test.com",
      password: "Gonza-12345",
    });

    token = res.body.token;
  });

  it("Deberia tener acceso a la ruta protegida con un token válido.", async () => {
    const res = await request(app)
      .get(`${api}/users`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("Deberia fallar sin token.", async () => {
    const res = await request(app).get(`${api}/users`);

    expect(res.status).toBe(401);
  });

  it("GET /users deberia retornar un array de usuarios.", async () => {
    const res = await request(app)
      .get(`${api}/users`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuarios obtenidos correctamente."
    );
    expect(res.body).toHaveProperty("error", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("total", 2);
    expect(res.body.meta).toHaveProperty("path", "/api/users");

    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: "Gonzalo",
          email: "gonzalo@test.com",
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: "Lucía",
          email: "lucia@test.com",
        }),
      ])
    );
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });
});
