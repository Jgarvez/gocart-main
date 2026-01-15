import { inngest } from "./client";
import prisma from "@/lib/prisma";

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;

    const primaryEmail =
      data.email_addresses[0]?.email_address ?? ""; // ✅ correct field
    const name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();

    await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: primaryEmail,
        name,
        image: data.image_url ?? "",
      },
      create: {
        id: data.id,
        email: primaryEmail,
        name,
        image: data.image_url ?? "",
      },
    });
  },
);

export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;

    const primaryEmail =
      data.email_addresses[0]?.email_address ?? ""; // ✅
    const name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: primaryEmail,
        name,
        image: data.image_url ?? "",
      },
    });
  },
);

export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.delete({
      where: { id: data.id },
    });
  },
);
