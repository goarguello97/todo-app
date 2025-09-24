import request from "supertest";
import app from "../app";
import prisma from "../prisma";

const api = "/api";

describe("Rutas de usuario", () => {
  let token;

  beforeAll(async () => {
    await prisma.user.deleteMany({});
  });

  it("GET /users deberia tener acceso a la ruta protegida con un token válido.", async () => {
    await prisma.user.create({
      data: {
        name: "Gonzalo",
        email: "gonzalo@test.com",
        password:
          "$2b$10$X5nmQPuhwyIom8p8sqlrk.W.UBYyUQBPHSGPbyU7tfCSV1j80v3xe",
      },
    });

    // Logueamos un usuario para obtener el token
    const login = await request(app).post(`${api}/auth/login`).send({
      email: "gonzalo@test.com",
      password: "Gonza-12345",
    });

    token = login.body.data.token;

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

  it("GET /users deberia retornar un array de usuarios vacío.", async () => {
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
    expect(res.body.meta).toHaveProperty("total", 0);
    expect(res.body.meta).toHaveProperty("path", "/api/users");

    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("GET /users deberia retornar un array de usuarios.", async () => {
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

  it("POST /users deberia fallar si falta el campo name.", async () => {
    const res = await request(app).post(`${api}/users`).send({
      email: "gonzalo@test.com",
      password: "Gonza-12345",
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
      name: "Gonzalo",
      password: "Gonza-12345",
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
    const res = await request(app).post(`${api}/users`).send({
      name: "Gonzalo",
      email: "gonzalo",
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
    const res = await request(app).post(`${api}/users`).send({
      name: "Gonzalo",
      email: "gonzalo",
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
    const res = await request(app).post(`${api}/users`).send({
      name: "Gonzalo",
      email: "gonzalo",
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
    const res = await request(app).post(`${api}/users`).send({
      name: "Gonzalo",
      email: "gonzalo",
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
    const res = await request(app).post(`${api}/users`).send({
      name: "Gonzalo",
      email: "gonzalo",
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
      name: "Gonzalo",
      email: "gonzalo",
      password: "Gonza-12345",
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
    await prisma.user.create({
      data: {
        name: "Gonzalo",
        email: "gonzalo@test.com",
        password:
          "$2b$10$X5nmQPuhwyIom8p8sqlrk.W.UBYyUQBPHSGPbyU7tfCSV1j80v3xe",
      },
    });

    const res = await request(app).post(`${api}/users`).send({
      name: "Gonzalo",
      email: "gonzalo@test.com",
      password: "Gonza-12345",
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
          message: "El email gonzalo@test.com ya se encuentra en uso.",
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
    const data = {
      name: "Gonzalo",
      email: "gonzalo@test.com",
      password: "Test-12345",
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
        name: "Gonzalo",
        email: "gonzalo@test.com",
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

    expect(res.body).toHaveProperty("errors", null);

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

    const data = { name: "Nicolás" };

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
    const user = await prisma.user.create({
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

    const data = { name: "Nicolás" };

    const res = await request(app)
      .put(`${api}/users/${user.id}`)
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
        name: "Nicolás",
        email: "gonzalo@test.com",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", `/api/users/${user.id}`);
  });

  it("PUT /users deberia modificar el usuario con exito(Email).", async () => {
    const user = await prisma.user.create({
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

    const data = { email: "nicolas@test.com" };

    const res = await request(app)
      .put(`${api}/users/${user.id}`)
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
        name: "Gonzalo",
        email: "nicolas@test.com",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", `/api/users/${user.id}`);
  });

  it("PUT /users deberia modificar el usuario con exito(Nombre y email).", async () => {
    const user = await prisma.user.create({
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

    const data = { name: "Nicolás", email: "nicolas@test.com" };

    const res = await request(app)
      .put(`${api}/users/${user.id}`)
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
        name: "Nicolás",
        email: "nicolas@test.com",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Task: [],
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toHaveProperty("timestamp");
    expect(res.body.meta).toHaveProperty("path", `/api/users/${user.id}`);
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
    const createdUser = await request(app).post(`${api}/users`).send({
      name: "Gonzalo",
      email: "gonzalo@test.com",
      password: "Test-12345",
    });

    const data = {
      currentPassword: "Test-1234",
      newPassword: "12345-Test",
    };

    const res = await request(app)
      .put(`${api}/users/update-password/${createdUser.body.data.id}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);

    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Contraseña actual incorrecta");
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: createdUser.body.data.id,
      })
    );

    expect(res.body).toHaveProperty("errors", null);

    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/users/update-password/${createdUser.body.data.id}`,
      })
    );
  });

  it("PUT /users/update-password/ deberia fallar si faltan campos.", async () => {
    const createdUser = await request(app).post(`${api}/users`).send({
      name: "Gonzalo",
      email: "gonzalo@test.com",
      password: "Test-12345",
    });

    const res = await request(app)
      .put(`${api}/users/update-password/${createdUser.body.data.id}`)
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
        path: `/api/users/update-password/${createdUser.body.data.id}`,
      })
    );
  });

  it("PUT /users/update-password/ deberia cambiar la contraseña exitosamente.", async () => {
    const createdUser = await request(app).post(`${api}/users`).send({
      name: "Gonzalo",
      email: "gonzalo@test.com",
      password: "Test-12345",
    });

    const data = { newPassword: "12345-Test", currentPassword: "Test-12345" };

    const res = await request(app)
      .put(`${api}/users/update-password/${createdUser.body.data.id}`)
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
        name: "Gonzalo",
        email: "gonzalo@test.com",
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
        path: `/api/users/update-password/${createdUser.body.data.id}`,
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

  it("DELETE /users deberia eliminar usuario con exito.", async () => {
    const createdUser = await request(app).post(`${api}/users`).send({
      name: "Gonzalo",
      email: "gonzalo@test.com",
      password: "Test-12345",
    });

    const res = await request(app)
      .delete(`${api}/users/${createdUser.body.data.id}`)
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
        id: createdUser.body.data.id,
      })
    );

    expect(res.body).toHaveProperty("errors", null);
    expect(res.body).toHaveProperty("meta");

    expect(res.body.meta).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        path: `/api/users/${createdUser.body.data.id}`,
      })
    );
  });

  afterEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });
});
