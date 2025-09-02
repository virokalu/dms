'use client'
import { deleteDeal, deleteHotel } from "@/app/lib/action";
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";
import { pink } from "@mui/material/colors";
import { startTransition, useActionState, useEffect } from "react";
import Notify from "../notify";
import { useRouter } from "next/navigation";

export function DeleteDeal({ id }: { id: string }) {
    const [state, deleteDealAction] = useActionState(deleteDeal, {
        id: id,
        type: "",
        message: "",
    });
    const router = useRouter();
    useEffect(() => {
        Notify(state.type, state.message);
        if (state.type == "success") {
            router.refresh();
        }
    }, [state, router])
    return (
        <form action={deleteDealAction}>
            <Button type="submit" className="p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <DeleteIcon sx={{ color: pink[500] }} />
            </Button>
        </form>
    )
}

export function DeleteHotel({ id, onDeleted }: { id: string; onDeleted: () => void }) {
    const [state, deleteHotelAction] = useActionState(deleteHotel, {
        id: id,
        type: "",
        message: "",
    });
    const router = useRouter();
    useEffect(() => {
        Notify(state.type, state.message);
        if (state.type == "success") {
            onDeleted();
        }
    }, [state, router])
    return (
                <Button variant="outlined" color="error" onClick={() => startTransition(() => deleteHotelAction())} className="p-2 hover:bg-gray-100">
                    <span className="sr-only">Delete</span>
                    <DeleteIcon sx={{ color: pink[500] }} />
                </Button>
    )
}