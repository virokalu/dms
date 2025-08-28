"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Deal } from "./definitions";

const API = new URL(`${process.env.API_URL}`);

const FormSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  video: z.string(),
});

const CreateDeal = FormSchema.omit({ id: true });
const UpdateDeal = FormSchema.omit({ id: true });

export async function createDeal(formData: FormData) {
  const { slug, name, video } = CreateDeal.parse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    video: formData.get("video"),
  });

  const data = {
    name: name,
    slug: slug,
    video: video,
  };

  try {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

    const res = await fetch(`${API}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const msg = (await res.text()).split("\n").join(",");
      throw new Error(msg);
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to create deals data.");
  } finally {
    revalidatePath("/dashboard/deals");
    redirect("/dashboard/deals");
  }
}

export async function updateDeal(formData: FormData){
  const { slug, name, video } = UpdateDeal.parse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    video: formData.get("video"),
  });

  const id = formData.get("id");

  const data = {
    name: name,
    slug: slug,
    video: video,
  };

  try {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const msg = (await res.text()).split("\n").join(",");
      throw new Error(msg);
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to create deals data.");
  } finally {
    revalidatePath("/dashboard/deals");
    redirect("/dashboard/deals");
  }
}
