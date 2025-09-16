'use client'
import { deleteDeal, deleteHotel, deleteMedia } from "@/app/lib/action";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { pink } from "@mui/material/colors";
import { startTransition, useActionState, useEffect } from "react";
import Notify from "../notify";
import { useRouter } from "next/navigation";
import React from "react";
import { UpdateMedia } from "@/app/lib/definitions";

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
    }, [state, router]);

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button sx={{ ml: 2 }} color="error" onClick={handleClickOpen} className="p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <DeleteIcon sx={{ color: pink[500] }} />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete the Deal
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to delete the deal?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>No</Button>
                    <Button color="error" variant="outlined" onClick={() => startTransition(() => {
                        deleteDealAction();
                        setOpen(false);
                    })} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
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

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //() => startTransition(() => deleteHotelAction())

    return (
        <React.Fragment>
            <Button sx={{ ml: 2 }} variant="outlined" color="error" onClick={handleClickOpen} className="p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <DeleteIcon sx={{ color: pink[500] }} />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete the Hotel
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to delete the hotel?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>No</Button>
                    <Button color="error" variant="outlined" onClick={() => startTransition(() => {
                        deleteHotelAction();
                        setOpen(false);
                    })} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export function DeleteMedia({ id, hotelId, onDeleted }: { id: string; hotelId: string; onDeleted: () => void }) {
    const [state, deleteHotelAction] = useActionState(deleteMedia, {
        id: hotelId,
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
        <Box>
            <Button sx={{ ml: 2 }} variant="outlined" color="error" onClick={() => startTransition(() => {
                const media: any = {
                    id: id,
                }
                deleteHotelAction(media);
            })} className="p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <DeleteIcon sx={{ color: pink[500] }} />
            </Button>
        </Box>
    )
}