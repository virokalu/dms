"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const API = new URL(`${process.env.API_URL}`);

const FormSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  video: z.string(),
});

const CreateDeal = FormSchema.omit({ id: true });
const UpdateDeal = FormSchema.omit({ id: true });

export async function createDeal(
  prevState: {
    type: string;
    message: string;
  },
  formData: FormData
): Promise<{ type: string; message: string }> {
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

  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

  const res = await fetch(`${API}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const msg = (await res.text()).split("\n").join(",");
    return {
      type: "error",
      message: `${msg}`,
    };
  } else {
    revalidatePath("/dashboard/deals");
    return {
      type: "success",
      message: "Deal created successfully",
    };

    // revalidatePath("/dashboard/deals");
    // redirect("/dashboard/deals");
  }
}

export async function updateDeal(
  prevState: {
    type: string;
    message: string;
  },
  formData: FormData
): Promise<{ type: string; message: string }> {
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
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const msg = (await res.text()).split("\n").join(",");
    return {
      type: "error",
      message: `${msg}`,
    };
  } else {
    revalidatePath("/dashboard/deals");
    return {
      type: "success",
      message: "Deal updated successfully",
    };
  }
}

export async function deleteDeal(prevState: {
  id: string;
  type: string;
  message: string;
}): Promise<{ id: string; type: string; message: string }> {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

  const res = await fetch(`${API}/${prevState.id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const msg = (await res.text()).split("\n").join(",");
    return {
      id: prevState.id,
      type: "error",
      message: `${msg || "Something went wrong"}`,
    };
  } else {
    return {
      id: prevState.id,
      type: "success",
      message: "Deal deleted successfully",
    };
  }
}
