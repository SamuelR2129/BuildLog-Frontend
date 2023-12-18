import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createAuth0User,
  deleteAuth0User,
  getAuth0Users,
  updateAuth0User,
} from "~/server/auth0";

type UpdateOptions = {
  email?: string;
  name: string;
  password?: string;
  app_metadata: { admin: boolean };
  connection: "Username-Password-Authentication";
};

export const manageEmployeesRouter = createTRPCRouter({
  getEmployees: protectedProcedure.query(async ({ ctx }) => {
    const employees = await getAuth0Users();
    return {
      employees,
    };
  }),

  updateEmployee: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        name: z.string(),
        email: z.string().optional(),
        password: z.string().optional(),
        admin: z.boolean(),
      }),
    )
    .mutation(async ({ input: { user_id, name, email, password, admin } }) => {
      const auth0Options: UpdateOptions = {
        email,
        name,
        app_metadata: { admin },
        connection: "Username-Password-Authentication",
      };

      if (password) auth0Options.password = password;

      return await updateAuth0User(JSON.stringify(auth0Options), user_id);
    }),

  deleteEmployee: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
      }),
    )
    .mutation(async ({ input: { user_id }, ctx }) => {
      await deleteAuth0User(user_id);
      return user_id;
    }),

  createEmployee: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(1),
        passwordVerifier: z.string().min(1),
        admin: z.boolean(),
      }),
    )
    .mutation(
      async ({ input: { name, email, password, passwordVerifier, admin } }) => {
        if (password !== passwordVerifier) {
          throw new Error("The password needs to match the passwordVerifier");
        }

        const data = JSON.stringify({
          email,
          name,
          password,
          app_metadata: { admin },
          connection: "Username-Password-Authentication",
        });

        await createAuth0User(data);
      },
    ),
});
