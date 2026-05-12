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
    SELECT id, name, email, "createdAt", role
    FROM neon_auth."user"
    ORDER BY "createdAt" DESC
  `;
  return rows as NeonUser[];
}
