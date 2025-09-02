'use client'
import { Deal, UpdateDealModel, UpdateHotelModel } from "@/app/lib/definitions";
import { Box, Button, TextField } from "@mui/material";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import Notify from "../notify";
import { updateDeal } from "@/app/lib/action";
import { useRouter } from "next/navigation";
import React from "react";

export default function EditDeal({ sentDeal }: { sentDeal: UpdateDealModel }) {
    const [state, updateDealAction] = useActionState(updateDeal, {
        type: "",
        message: "",
    });
    const router = useRouter();
    useEffect(() => {
        Notify(state.type, state.message);
        if (state.type == "success") {
            router.back();
        }
    }, [state, router])

    //React Stepper
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        console.log(deal)
    };

    //Deal and Hotels
    const [deal, setDeal] = useState<UpdateDealModel>(sentDeal);

    //Hotel Changes
        const handleHotelChange = (index: number, field: keyof UpdateHotelModel, value: string | number) => {
            const updatedHotels = [...deal.hotels];
            if (field === 'name' || field === 'amenities') {
                updatedHotels[index][field] = value as string;
            } else if (field === 'rate') {
                updatedHotels[index][field] = value as number;
            }
            setDeal({ ...deal, hotels: updatedHotels });
        };
    
        const addHotel = () => {
            setDeal({ ...deal, hotels: [...deal.hotels, { id:'0', name: '', rate: 0, amenities: '' }] });
        };

    return (
        <Box>
            <form action={updateDealAction}>
                <Box
                    sx={{
                        minWidth: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,

                    }}
                >
                    <input

                        type="number"
                        hidden
                        readOnly
                        name='id'
                        value={deal.id}
                    />
                    <TextField
                        id="slug"
                        name='slug'
                        label="Slug"
                        variant="outlined"
                        required
                        value={deal.slug}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                    />

                    <TextField
                        id="name"
                        name='name'
                        label="Name"
                        variant="outlined"
                        required
                        defaultValue={deal.name}
                    />

                    <TextField
                        id="video"
                        name='video'
                        label="Video URL"
                        variant="outlined"
                        defaultValue={deal.video}
                    />
                </Box>
                <Box className='mt-6 flex gap-4'>
                    <Link href={'/dashboard/deals'}>
                        <Button variant="outlined" className='px-4'>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="contained" color="primary">
                        Update
                    </Button>
                </Box>
            </form>
        </Box>
    )
}