import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const url = process.env.VITE_SUPABASE_URL || "";
const key = process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(url, key);

async function test() {
  console.log("Fetching user_documents schema / test row...");
  const { data, error } = await supabase
    .from("user_documents")
    .select("*")
    .limit(1);
  console.log("Data:", data);
  console.log("Error:", error);
}

test();
