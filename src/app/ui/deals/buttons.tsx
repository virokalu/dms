import { deleteDeal } from "@/app/lib/action";
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";
import { pink } from "@mui/material/colors";

export function DeleteDeal({ id }: { id: string }) {
    const deleteDealWithId = deleteDeal.bind(null, id);
    return (
        <form action={deleteDealWithId}>
            <Button type="submit" className="p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <DeleteIcon sx={{ color: pink[500] }}/>
            </Button>
        </form>
    )
}