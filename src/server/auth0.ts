import { type GetUsers200ResponseOneOfInner } from "auth0";
import { env } from "~/env.mjs";

type AccessToken = {
  access_token: string;
};

export const getAuth0ManagementAccessToken = async () => {
  const res = await fetch(env.AUTH0_TOKEN_GENERATOR_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: env.AUTH0_API_ID,
      client_secret: env.AUTH0_API_SECRET,
      audience: env.AUTH0_API_URL,
      grant_type: "client_credentials",
    }),
  });

  if (res.status !== 200) {
    const error = (await res.json()) as { message?: string };
    throw new Error(`Error with auth0 token creation. - ${error?.message}`);
  }

  const token = (await res.json()) as AccessToken;

  if (!token.access_token) {
    throw new Error(`Auth0 token endpoint structure is unexpected`);
  }

  return token.access_token;
};

export const createAuth0User = async (data: string) => {
  const token = await getAuth0ManagementAccessToken();

  const res = await fetch(`${env.AUTH0_API_URL}users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: data,
  });

  if (res.status !== 201) {
    const error = (await res.json()) as { message?: string };
    throw new Error(`Error with auth0 create. - ${error?.message}`);
  }

  return (await res.json()) as GetUsers200ResponseOneOfInner;
};

export const updateAuth0User = async (data: string, userId: string) => {
  const token = await getAuth0ManagementAccessToken();

  const res = await fetch(`${env.AUTH0_API_URL}users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: data,
  });

  if (res.status !== 200) {
    const error = (await res.json()) as { message?: string };
    throw new Error(`Error with auth0 update. - ${error?.message}`);
  }

  return (await res.json()) as GetUsers200ResponseOneOfInner;
};

export const deleteAuth0User = async (userId: string) => {
  const token = await getAuth0ManagementAccessToken();

  const res = await fetch(`${env.AUTH0_API_URL}users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (res.status !== 204) {
    const error = (await res.json()) as { message?: string };
    throw new Error(`Error with auth0 delete. - ${error.message}`);
  }
};
