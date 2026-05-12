import { neon } from "@neondatabase/serverless";

export type NeonUser = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  role: string | null;
};

export async function getUsers(): Promise<NeonUser[]> {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT id, name, email, created_at AS "createdAt", role
    FROM neon_auth.users
    ORDER BY created_at DESC
  `;
  return rows as NeonUser[];
}
