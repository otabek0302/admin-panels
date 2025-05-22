import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type CategoryUpdatePayload = {
    name: string;
};

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body: CategoryUpdatePayload = await req.json();

        const updated = await prisma.category.update({
            where: { id: params.id },
            data: { name: body.name },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[CATEGORY_PATCH_ERROR]", error);
        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}

// @ts-nocheck
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.category.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[CATEGORY_DELETE_ERROR]", error);
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}