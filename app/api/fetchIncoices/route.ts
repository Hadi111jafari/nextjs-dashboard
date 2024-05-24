// app/api/fetchLatestInvoices/route.js
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { formatCurrency } from "@/app/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fetchAll = searchParams.get("all");

  try {
    const data = await sql`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT ${fetchAll ? null : 5}`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return NextResponse.json(latestInvoices);
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch the latest invoices.", error: error.message },
      { status: 500 },
    );
  }
}
