'use client'
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";

export default function ToastProvider(){
    return <Box>
        <ToastContainer position="top-right" autoClose={3000}/>
    </Box>
}