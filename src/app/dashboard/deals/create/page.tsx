'use client'
import TextField from '@mui/material/TextField'
import { Box, Button, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material'
import Link from 'next/link';
import { createDeal } from '@/app/lib/action';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Notify from '@/app/ui/notify';
import React from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

const steps = ['Add Deal Details', 'Add Hotels'];

import { yupResolver } from '@hookform/resolvers/yup';
import { CreateDealModel, dealSchema } from '@/app/lib/definitions';

export default function Page() {
    const [state, createDealAction] = useActionState(createDeal, {
        type: "",
        message: "",
    });

    //Handle Notification
    const router = useRouter();
    
    useEffect(() => {
        Notify(state.type, state.message);
        if (state.type == "success") {
            router.back();
        }
    }, [state, router])

    //React Stepper
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = async () => {
        const isValid = await trigger(['slug', 'name', 'video']); // fields for step 1
        if (isValid) setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    //Handle Submission
    const onSubmit: SubmitHandler<CreateDealModel> = async (data) => {
        await createDealAction(data);
    };
    // const onError: SubmitErrorHandler<CreateDealModel> = (errors) => console.log(errors)

    //ReactHookForm Yup Validation
    const { control, trigger, handleSubmit, formState: {errors}} = useForm<CreateDealModel>(
        {
            resolver: yupResolver(dealSchema),
            defaultValues: {
                slug: '',
                name: '',
                video: '',
                hotels: [
                    { name: '', rate: 0, amenities: '' }
                ]
            }
        }
    );

    const { fields, append, remove } = useFieldArray({
        control,
        name: "hotels",
    })

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
                <form onSubmit={handleSubmit(onSubmit)}>
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
                            <Controller
                                control={control}
                                name='slug'
                                render={({ field }) => (
                                    <TextField
                                        id="slug"
                                        label="Slug"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.slug}
                                        helperText={errors.slug?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='name'
                                render={({ field }) => (
                                    <TextField
                                        id="name"
                                        label="Name"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='video'
                                render={({ field }) => (
                                    <TextField
                                        id="video"
                                        label="Video"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.video}
                                        helperText={errors.video?.message}
                                    />
                                )}
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
                                {fields.map((field, index) => (
                                    <Box key={field.id} sx={{
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        borderColor: '#bdbdbd',
                                        padding: 5,
                                        marginBottom: 4
                                    }}>
                                        <Grid container spacing={2} key={index}>
                                            <Typography sx={{ pt: 2 }}>Hotel {index + 1}</Typography>
                                            <Controller
                                                control={control}
                                                name={`hotels.${index}.name`}
                                                render={({ field }) => (
                                                    <TextField
                                                        label="Name"
                                                        fullWidth
                                                        {...field}
                                                        error={!!errors.hotels?.[index]?.name}
                                                        helperText={errors.hotels?.[index]?.name?.message}
                                                    />
                                                )}

                                            />
                                            <Controller
                                                control={control}
                                                name={`hotels.${index}.rate`}
                                                render={({ field }) => (
                                                    <TextField
                                                        label="Rate"
                                                        type="number"
                                                        fullWidth
                                                        inputProps={{ step: 0.1, min: 0, max: 1 }}
                                                        {...field}
                                                        error={!!errors.hotels?.[index]?.rate}
                                                        helperText={errors.hotels?.[index]?.rate?.message}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name={`hotels.${index}.amenities`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        label="Amenities"
                                                        fullWidth
                                                        {...field}
                                                        error={!!errors.hotels?.[index]?.amenities}
                                                        helperText={errors.hotels?.[index]?.amenities?.message}
                                                    />
                                                )}
                                            />
                                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, width: '100%' }}>
                                                <Box sx={{ flex: '1 1 auto' }} />
                                                {index == fields.length - 1 ? <Button variant="outlined" onClick={()=>append({name: '', rate: 0, amenities: ''})}>Add Hotel</Button> : null}
                                                {fields.length > 1 ? <Button sx={{ ml: 2 }} variant="outlined" color='warning' onClick={()=>remove(index)}>Remove Hotel {index + 1}</Button> : null}
                                            </Box>
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>



                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
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
            <Box sx={{ flex: '1' }} />

        </Box>
    );
}