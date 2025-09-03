'use client'
import { UpdateDealModel } from "@/app/lib/definitions";
import { Box, Button, Grid, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import Notify from "../notify";
import { updateHotelDeal } from "@/app/lib/action";
import { useRouter } from "next/navigation";
import React from "react";
import { DeleteHotel } from "./buttons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray, SubmitHandler, SubmitErrorHandler, Controller } from "react-hook-form";
import * as yup from 'yup';

const steps = ['Update Deal Details', 'Update Hotels'];

const dealSchema = yup.object().shape({
    id: yup.string().required(),
    slug: yup.string().required('Slug is required'),
    name: yup.string().required('Name is required'),
    video: yup.string().url('Must be a valid URL').required('Video URL is required'),
    hotels: yup.array().of(
        yup.object().shape({
            id: yup.string().required(),
            name: yup.string().required('Hotel name is required'),
            rate: yup.number().typeError('Rate is a number between 0 and 1').min(0).max(1).required('Rate is required'),
            amenities: yup.string().required('Amenities is required'),
        })
    ).min(1, "At least one Hotel required").required(),
});
export default function EditDeal({ sentDeal }: { sentDeal: UpdateDealModel }) {
    const [state, updateDealAction] = useActionState(updateHotelDeal, {
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

    //ReactHookForm Yup Validation
    const { control, trigger, handleSubmit, formState: { errors }, watch } = useForm<UpdateDealModel>(
        {
            resolver: yupResolver(dealSchema),
            defaultValues: sentDeal
        }
    );
    const { fields, append, remove } = useFieldArray({
        control,
        name: "hotels",
    })

    //React Stepper
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = async () => {
        const isValid = await trigger(['slug', 'name', 'video']); //Validate Feils in Deal
        if(isValid){
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    //Handle Submission
    const onSubmit: SubmitHandler<UpdateDealModel> = async (data) => {
        await updateDealAction(data);
    };
    const onError: SubmitErrorHandler<UpdateDealModel> = (errors) => console.log("errors")

    const handleHotelDeleted = (deletedHotelId: number) => {
        
        remove(deletedHotelId)
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
                <form onSubmit={handleSubmit(onSubmit, onError)}>
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
                                        label="Video URL"
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
                            <Typography sx={{ pt: 4 }} variant="h6">Update Hotels</Typography>

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
                                                name={`hotels.${index}.id`}
                                                render={({ field }) => (
                                                    <TextField
                                                        fullWidth
                                                        {...field}
                                                        hidden
                                                        error={!!errors.hotels?.[index]?.name}
                                                        helperText={errors.hotels?.[index]?.name?.message}
                                                    />
                                                )}
                                            />
                                            
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
                                                control={control}
                                                name={`hotels.${index}.amenities`}
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
                                                {index == fields.length - 1 ? <Button variant="outlined" onClick={()=>append({id: '0',name: '', rate: 0, amenities: ''})}>Add Hotel</Button> : null}
                                                {fields.length > 1 && watch(`hotels.${index}.id`) == '0' ? <Button sx={{ ml: 2 }} variant="outlined" color='warning' onClick={()=>remove(index)}>Remove Hotel {index + 1}</Button> : null}
                                                {watch(`hotels.${index}.id`) != '0' ? <DeleteHotel id={watch(`hotels.${index}.id`)} onDeleted={() => handleHotelDeleted(index)} /> : null}
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