import { deleteDeal } from "@/app/lib/action";
import DeleteIcon from '@mui/icons-material/Delete';

export function DeleteDeal({ id }: { id: string }) {
    const deleteDealWithId = deleteDeal.bind(null, id);
    return (
        <form action={deleteDealWithId}>
            <button type="submit" className="p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <DeleteIcon />
            </button>
        </form>
    )
}