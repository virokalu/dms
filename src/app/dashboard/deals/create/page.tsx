'use client'
import TextField from '@mui/material/TextField'
import { Box, Button, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material'
import Link from 'next/link';
import { createDeal } from '@/app/lib/action';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Notify from '@/app/ui/notify';
import React from 'react';
import { CreateDealModel, Hotel } from '@/app/lib/definitions';

const steps = ['Add Deal Details', 'Add Hotels'];

export default function Page() {
    const [state, createDealAction] = useActionState(createDeal, {
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
    const [deal, setDeal] = useState<CreateDealModel>({
        slug: '',
        name: '',
        video: '',
        hotels: [
            { name: '', rate: 0, amenities: '' }
        ]
    });

    //Hotel Changes
    const handleHotelChange = (index: number, field: keyof Hotel, value: string | number) => {
        const updatedHotels = [...deal.hotels];
        if (field === 'name' || field === 'amenities') {
            updatedHotels[index][field] = value as string;
        } else if (field === 'rate' || field === 'id') {
            updatedHotels[index][field] = value as number;
        }
        setDeal({ ...deal, hotels: updatedHotels });
    };

    const addHotel = () => {
        setDeal({ ...deal, hotels: [...deal.hotels, { name: '', rate: 0, amenities: '' }] });
    };

    const removeHotel = () => {
        if (deal.hotels.length > 1) {
            setDeal({ ...deal, hotels: deal.hotels.slice(0, -1) });
        }
    }

    //Handle Submission
    const handleSubmit = async () => {
        await createDealAction(deal);
        // try {
        //     const formData = new FormData();

        //     // Add deal fields
        //     formData.append('slug', deal.slug);
        //     formData.append('name', deal.name);
        //     formData.append('video', deal.video);

        //     // Add hotel fields
        //     deal.hotels.forEach((hotel, index) => {
        //         formData.append(`hotels[${index}][name]`, hotel.name);
        //         formData.append(`hotels[${index}][rate]`, hotel.rate.toString());
        //         formData.append(`hotels[${index}][amenities]`, hotel.amenities);
        //     });

        //     // Send to your API
        //     await createDealAction(formData);
        // } catch (error) {
        //     console.error(error);
        // }
    };


    return (
        <Box>
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
                <form action={handleSubmit}>
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
                            <Typography sx={{ pt: 4 }} variant="h6">New Hotels</Typography>

                            <Box sx={{ pt: 2 }}>
                                {deal.hotels.map((hotel, index) => (
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
                                    </Grid>
                                ))}
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button variant="outlined" onClick={addHotel}>Add Hotel</Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {deal.hotels.length > 1 ? <Button variant="outlined" color='warning' onClick={removeHotel}>Remove Hotel</Button> : null}
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
                                    Create
                                </Button>
                            </Box>
                        </React.Fragment>
                        )
                    }
                </form>
            </Box>
            {/* <form action={createDealAction}>
                <Box
                    sx={{
                        minWidth: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,

                    }}
                >
                    <TextField
                        id="slug"
                        name='slug'
                        label="Slug"
                        variant="outlined"
                        required

                    />

                    <TextField
                        id="name"
                        name='name'
                        label="Name"
                        variant="outlined"
                        required

                    />

                    <TextField
                        id="video"
                        name='video'
                        label="Video URL"
                        variant="outlined"
                    />
                </Box>
                <Box className='mt-6 flex gap-4'>
                    <Link href={'/dashboard/deals'}>
                        <Button variant="outlined" className='px-4'>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </form> */}
        </Box>
    );
}