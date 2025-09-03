'use client'
import { UpdateDealModel, UpdateHotelModel } from "@/app/lib/definitions";
import { Box, Button, Grid, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import Notify from "../notify";
import { updateHotelDeal } from "@/app/lib/action";
import { useRouter } from "next/navigation";
import React from "react";
import { DeleteHotel } from "./buttons";

const steps = ['Update Deal Details', 'Update Hotels'];

export default function EditDeal({ sentDeal }: { sentDeal: UpdateDealModel }) {
    const [state, updateDealAction] = useActionState(updateHotelDeal, {
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

    // const handleReset = () => {
    //     console.log(deal)
    // };

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
        setDeal({ ...deal, hotels: [...deal.hotels, { id: '0', name: '', rate: 0, amenities: '' }] });
    };

    const removeHotel = () => {
        if (deal.hotels.length > 1) {
            setDeal({ ...deal, hotels: deal.hotels.slice(0, -1) });
        }
    }

    const handleUpdate = async () => {
        await updateDealAction(deal);
    }

    //Delete Hotel
    const handleHotelDeleted = (deletedHotelId: string) => {
        setDeal(deal => ({
            ...deal,
            hotels: deal.hotels.filter(h => h.id !== deletedHotelId),
        }));
        console.log(deal)
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ flex: '1' }} />
            <Box sx={{ width: '100%', maxWidth: 700 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};

                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <form action={handleUpdate}>
                    {activeStep == 0 ? (<React.Fragment>

                        {/* Deal Text Feild Here */}

                        <Typography sx={{ pt: 4 }} variant="h6">New Deal Details</Typography>
                        <Box
                            sx={{
                                minWidth: 500,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                pt: 2,
                            }}
                        >
                            <TextField
                                id="slug"
                                name='slug'
                                label="Slug"
                                variant="outlined"
                                required
                                value={deal.slug}
                                onChange={(e) => setDeal({ ...deal, slug: e.target.value })}
                            />

                            <TextField
                                id="name"
                                name='name'
                                label="Name"
                                variant="outlined"
                                required
                                value={deal.name}
                                onChange={(e) => setDeal({ ...deal, name: e.target.value })}
                            />

                            <TextField
                                id="video"
                                name='video'
                                label="Video URL"
                                variant="outlined"
                                value={deal.video}
                                onChange={(e) => setDeal({ ...deal, video: e.target.value })}
                            />

                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Link href={'/dashboard/deals'}>
                                    <Button variant="outlined" className='px-4'>Cancel</Button>
                                </Link>
                                <Box sx={{ flex: '1 1 auto' }} />

                                <Button variant="contained" color="primary" onClick={handleNext}>
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </React.Fragment>)
                        : (<React.Fragment>

                            {/* Hotel Text Feilds Here */}
                            <Typography sx={{ pt: 4 }} variant="h6">Update Hotels</Typography>

                            <Box sx={{ pt: 2 }}>
                                {deal.hotels.map((hotel, index) => (
                                    <Box key={index} sx={{
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        borderColor: '#bdbdbd',
                                        padding: 5,
                                        marginBottom: 4
                                    }}>
                                        <Grid container spacing={2} key={index}>
                                            <Typography sx={{ pt: 2 }}>Hotel {index + 1}</Typography>
                                            <TextField
                                                label="Name"
                                                fullWidth
                                                value={hotel.name}
                                                onChange={(e) => handleHotelChange(index, 'name', e.target.value)}
                                            />
                                            <TextField
                                                label="Rate"
                                                type="number"
                                                fullWidth
                                                inputProps={{ step: 0.1, min: 0, max: 1 }}
                                                value={hotel.rate}
                                                onChange={(e) => handleHotelChange(index, 'rate', parseFloat(e.target.value))}
                                            />
                                            <TextField
                                                label="Amenities"
                                                fullWidth
                                                value={hotel.amenities}
                                                onChange={(e) => handleHotelChange(index, 'amenities', e.target.value)}
                                            />
                                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, width:'100%' }}>
                                                <Box sx={{ flex: '1 1 auto' }} />
                                                {index == deal.hotels.length - 1 ? <Button variant="outlined" onClick={addHotel}>Add Hotel</Button>: null}
                                                {deal.hotels.length > 1 && hotel.id == '0' ? <Button sx={{ ml: 2 }} variant="outlined" color='warning' onClick={removeHotel}>Remove Hotel {index+1}</Button> : null}
                                                {hotel.id != '0' ? <DeleteHotel id={hotel.id} onDeleted={() => handleHotelDeleted(hotel.id)} /> : null}
                                            </Box>
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>



                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />

                                <Button type="submit" variant="contained" color="primary">
                                    Update
                                </Button>
                            </Box>
                        </React.Fragment>
                        )
                    }
                </form>
            </Box>
            <Box sx={{ flex: '1' }} />
            {/* <form action={handleUpdate}>
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
            </form> */}
        </Box>
    )
}