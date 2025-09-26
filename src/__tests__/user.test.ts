import request from "supertest";
import app from "../app";
import prisma from "../prisma";

const api = "/api";

xdescribe("CRUD de usuario", () => {
  let userId: string;
  let userEmail: string;
  let token: string;

  beforeAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});
    const uniqueEmail = `Joe+crud${Date.now()}@test.com`;

    const user = await request(app).post(`${api}/users`).send({
      name: "Joe",
      email: uniqueEmail,
      password: "Test-12345",
    });

    const login = await request(app).post(`${api}/auth/login`).send({
      email: uniqueEmail,
      password: "Test-12345",
    });

    userId = user.body.data.id;
    userEmail = user.body.data.email;
    token = login.body.data.token;
  });

  it("GET /users deberia retornar un array con un usuario.", async () => {
    const res = await request(app)
      .get(`${api}/users`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuarios obtenidos correctamente."
    );
    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("total", 1);
    expect(res.body.meta).toHaveProperty("path", "/api/users");

    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: userId,
          name: "Joe",
          email: userEmail,
        }),
      ])
    );
  });

  it("PUT /users deberia modificar el usuario con exito(Nombre).", async () => {
    const data = { name: "John", email: userEmail };

    const res = await request(app)
      .put(`${api}/users/${userId}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario actualizado correctamente."
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John",
        email: userEmail,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", `/api/users/${userId}`);
  });

  it("PUT /users deberia modificar el usuario con exito(Email).", async () => {
    const uniqueEmail = `Joe+crud${Date.now()}@test.com`;

    const res = await request(app)
      .put(`${api}/users/${userId}`)
      .send({ email: uniqueEmail })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario actualizado correctamente."
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John",
        email: uniqueEmail,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", `/api/users/${userId}`);
  });

  it("PUT /users deberia modificar el usuario con exito(Nombre y email).", async () => {
    userEmail = `John+crud${Date.now()}@test.com`;
    const data = { name: "John", email: userEmail };

    const res = await request(app)
      .put(`${api}/users/${userId}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario actualizado correctamente."
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: data.name,
        email: data.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", `/api/users/${userId}`);
  });

  it("PUT /users/update-password/ deberia cambiar la contraseña exitosamente.", async () => {
    const data = { newPassword: "12345-Test", currentPassword: "Test-12345" };

    const res = await request(app)
      .put(`${api}/users/update-password/${userId}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Contraseña modificada con éxito."
    );

    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John",
        email: userEmail,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/users/update-password/${userId}`,
      })
    );
  });

  it("DELETE /users deberia eliminar usuario con exito.", async () => {
    const res = await request(app)
      .delete(`${api}/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario eliminado correctamente."
    );
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: userId,
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/users/${userId}`,
      })
    );
  });
});

xdescribe("Rutas de usuario", () => {
  let token: string;
  let userId: string;
  let userEmail: string;

  beforeAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});

    const uniqueEmail = `Joe+crud${Date.now()}@test.com`;

    const user = await request(app).post(`${api}/users`).send({
      name: "Joe",
      email: uniqueEmail,
      password: "Test-12345",
    });

    const login = await request(app).post(`${api}/auth/login`).send({
      email: uniqueEmail,
      password: "Test-12345",
    });

    token = login.body.data.token;
    userId = user.body.data.id;
    userEmail = user.body.data.email;
  });

  it("GET /users deberia tener acceso a la ruta protegida con un token válido.", async () => {
    const res = await request(app)
      .get(`${api}/users`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("GET /users deberia fallar sin token.", async () => {
    const res = await request(app).get(`${api}/users`);

    expect(res.status).toBe(401);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Token no proporcionado.");
    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/users",
      })
    );
  });

  xit("GET /users deberia retornar un array de usuarios.", async () => {
    await prisma.user.createMany({
      data: {
        name: "John",
        email: `John+crud${Date.now()}@test.com`,
        password:
          "$2b$10$X5nmQPuhwyIom8p8sqlrk.W.UBYyUQBPHSGPbyU7tfCSV1j80v3xe",
      },
    });

    const res = await request(app)
      .get(`${api}/users`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuarios obtenidos correctamente."
    );
    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("total", 2);
    expect(res.body.meta).toHaveProperty("path", "/api/users");

    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /users deberia fallar si falta el campo name.", async () => {
    const res = await request(app)
      .post(`${api}/users`)
      .send({
        email: `Joe+crud${Date.now()}@test.com`,
        password: "Test-12345",
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "name",
          message: "El nombre es requerido.",
        }),
        expect.objectContaining({
          field: "name",
          message: "Mínimo 3 caracteres y maximo 30 caracteres.",
        }),
      ])
    );
  });

  it("POST /users deberia fallar si falta el campo email.", async () => {
    const res = await request(app).post(`${api}/users`).send({
      name: "Joe",
      password: "Test-12345",
    });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "email",
          message: "El email es requerido.",
        }),
      ])
    );
  });

  it("POST /users deberia fallar si falta el campo password.", async () => {
    const res = await request(app)
      .post(`${api}/users`)
      .send({
        name: "Joe",
        email: `Joe+crud${Date.now()}@test.com`,
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "password",
          message:
            "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.",
        }),
      ])
    );
  });

  it("POST /users deberia fallar si faltan condiciones en campo password(Falta letra mayúscula).", async () => {
    const res = await request(app)
      .post(`${api}/users`)
      .send({
        name: "Joe",
        email: `Joe+crud${Date.now()}@test.com`,
        password: "test-12345",
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "password",
          message:
            "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.",
        }),
      ])
    );
  });

  it("POST /users deberia fallar si faltan condiciones en campo password(Falta caracter especial).", async () => {
    const res = await request(app)
      .post(`${api}/users`)
      .send({
        name: "Joe",
        email: `Joe+crud${Date.now()}@test.com`,
        password: "Test12345",
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "password",
          message:
            "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.",
        }),
      ])
    );
  });

  it("POST /users deberia fallar si faltan condiciones en campo password(Falta un caracter númerico).", async () => {
    const res = await request(app)
      .post(`${api}/users`)
      .send({
        name: "Joe",
        email: `Joe+crud${Date.now()}@test.com`,
        password: "Test-",
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "password",
          message:
            "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.",
        }),
      ])
    );
  });

  it("POST /users deberia fallar si faltan condiciones en campo password(No completa la cantidad mínima de caracteres).", async () => {
    const res = await request(app)
      .post(`${api}/users`)
      .send({
        name: "Joe",
        email: `Joe+crud${Date.now()}@test.com`,
        password: "Test-12",
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "password",
          message:
            "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.",
        }),
      ])
    );
  });

  it("POST /users deberia fallar si no es un email valido.", async () => {
    const res = await request(app).post(`${api}/users`).send({
      name: "Joe",
      email: "joe",
      password: "Test-12345",
    });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "email",
          message: "Ingrese un email válido.",
        }),
      ])
    );
  });

  it("POST /users deberia fallar si el email esta en uso.", async () => {
    const res = await request(app).post(`${api}/users`).send({
      name: "Joe",
      email: userEmail,
      password: "test-12345",
    });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "email",
          message: `El email ${userEmail} ya se encuentra en uso.`,
        }),
      ])
    );

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/users",
      })
    );
  });

  it("POST /users deberia ser exitoso con todos los campos obligatorios.", async () => {
    const uniqueEmail = `Joe+crud${Date.now()}@test.com`;

    const data = {
      name: "Joe",
      email: `Joe+crud${Date.now()}@test.com`,
      password: uniqueEmail,
    };

    const res = await request(app).post(`${api}/users`).send(data);

    expect(res.status).toBe(201);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario registrado correctamente."
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Joe",
        email: uniqueEmail,
        createdAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");
    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/users",
      })
    );
  });

  it("PUT /users deberia fallar si falta el id.", async () => {
    const res = await request(app)
      .put(`${api}/users/`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "El parámetro 'id' es requerido."
    );
    expect(res.body).toHaveProperty("data", null);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "params",
          message: "Debe enviar el id del usuario en la URL.",
        }),
      ])
    );

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/users/",
      })
    );
  });

  it("PUT /users deberia fallar si el usuario no existe.", async () => {
    const randomId = "9b36a9a7-775a-416f-9767-5d16b6b99b50";

    const data = { name: "John" };

    const res = await request(app)
      .put(`${api}/users/${randomId}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Usuario no encontrado.");
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: randomId,
      })
    );

    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/users/${randomId}`,
      })
    );
  });

  it("PUT /users deberia modificar el usuario con exito(Nombre).", async () => {
    const data = { name: "John", email: userEmail };

    const res = await request(app)
      .put(`${api}/users/${userId}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario actualizado correctamente."
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John",
        email: userEmail,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", `/api/users/${userId}`);
  });

  it("PUT /users deberia modificar el usuario con exito(Email).", async () => {
    const uniqueEmail = `John+crud${Date.now()}@test.com`;
    const data = { email: uniqueEmail };

    const res = await request(app)
      .put(`${api}/users/${userId}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario actualizado correctamente."
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John",
        email: uniqueEmail,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", `/api/users/${userId}`);
  });

  it("PUT /users deberia modificar el usuario con exito(Nombre y email).", async () => {
    const uniqueEmail = `Random+crud${Date.now()}@test.com`;
    userEmail = uniqueEmail;

    const data = { name: "Random", email: uniqueEmail };

    const res = await request(app)
      .put(`${api}/users/${userId}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario actualizado correctamente."
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Random",
        email: uniqueEmail,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", `/api/users/${userId}`);
  });

  it("PUT /users/update-password deberia fallar si falta el id.", async () => {
    const res = await request(app)
      .put(`${api}/users/update-password/`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "El parámetro 'id' es requerido."
    );
    expect(res.body).toHaveProperty("data", null);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "params",
          message: "Debe enviar el id del usuario en la URL.",
        }),
      ])
    );

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/users/update-password/",
      })
    );
  });

  it("PUT /users/update-password/ deberia fallar si el usuario no existe.", async () => {
    const randomId = "9b36a9a7-775a-416f-9767-5d16b6b99b50";

    const data = {
      currentPassword: "Test-12345",
      newPassword: "12345-Test",
    };

    const res = await request(app)
      .put(`${api}/users/update-password/${randomId}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Usuario no encontrado.");
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: randomId,
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/users/update-password/${randomId}`,
      })
    );
  });

  it("PUT /users/update-password/ deberia fallar si la contraseña actual es incorrecta.", async () => {
    const data = {
      currentPassword: "Test-1234",
      newPassword: "12345-Test",
    };

    const res = await request(app)
      .put(`${api}/users/update-password/${userId}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Contraseña actual incorrecta");
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: userId,
      })
    );

    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/users/update-password/${userId}`,
      })
    );
  });

  it("PUT /users/update-password/ deberia fallar si faltan campos.", async () => {
    const res = await request(app)
      .put(`${api}/users/update-password/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Error de validación.");
    expect(res.body).toHaveProperty("data", null);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "newPassword",
          message: "La nueva contraseña es requerida.",
        }),
        expect.objectContaining({
          field: "currentPassword",
          message: "La contraseña actual es requerida.",
        }),
        expect.objectContaining({
          field: "newPassword",
          message:
            "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.",
        }),
      ])
    );

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/users/update-password/${userId}`,
      })
    );
  });

  it("PUT /users/update-password/ deberia cambiar la contraseña exitosamente.", async () => {
    const data = { newPassword: "12345-Test", currentPassword: "Test-12345" };

    const res = await request(app)
      .put(`${api}/users/update-password/${userId}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Contraseña modificada con éxito."
    );

    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Random",
        email: userEmail,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/users/update-password/${userId}`,
      })
    );
  });

  it("DELETE /users deberia fallar si falta el id.", async () => {
    const res = await request(app)
      .delete(`${api}/users/`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "El parámetro 'id' es requerido."
    );
    expect(res.body).toHaveProperty("data", null);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "params",
          message: "Debe enviar el id del usuario en la URL.",
        }),
      ])
    );

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: "/api/users/",
      })
    );
  });

  it("DELETE /users deberia fallar si el usuario no existe.", async () => {
    const randomId = "9b36a9a7-775a-416f-9767-5d16b6b99b50";

    const res = await request(app)
      .delete(`${api}/users/${randomId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Usuario no encontrado.");
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: randomId,
      })
    );

    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/users/${randomId}`,
      })
    );
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
