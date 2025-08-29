import request from "supertest";
import app from "../app";

const api = "/api";

describe("Rutas de usuario", () => {
  let token: string;

  beforeAll(async () => {
    //Simulamos el login para obtener el token.
    const res = await request(app).post(`${api}/auth/login`).send({
      email: "arguello@gmail.com",
      password: "Gonza-12345",
    });
    token = res.body.token;
  });

  it("Deberia tener acceso a la ruta protegida con un token válido. GET /users deberia retornar un array de usuarios", async () => {
    const res = await request(app)
      .get(`${api}/users`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Gonzalo" })])
    );
  });

  it("Deberia fallar sin token", async () => {
    const res = await request(app).get(`${api}/users`);

    expect(res.status).toBe(401);
  });
});
