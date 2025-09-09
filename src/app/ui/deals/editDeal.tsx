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
import { useForm, useFieldArray, SubmitHandler, SubmitErrorHandler, Controller } from "react-hook-form";

const steps = ['Update Deal Details', 'Update Hotels'];

export default function EditDeal({ sentDeal, API }: { sentDeal: UpdateDealModel, API: string }) {
    const [state, updateDealAction] = useActionState(updateHotelDeal, {
        type: "",
        message: "",
    });

    //Handle Image
    // const [imageFile, setImageFile] = useState<File | null>(null);
    // const [imageLink, setImageLink] = useState<string | null>(null);

    //Handle Notification
    const router = useRouter();
    useEffect(() => {

        // if(sentDeal.image)
        //     setImageLink(`${API}/${sentDeal.image}`);

        Notify(state.type, state.message);
        if (state.type == "success") {
            router.back();
        }
    }, [state, router])

    //ReactHookForm Yup Validation
    const { control,register,setValue, trigger, handleSubmit, formState: { errors }, watch } = useForm<UpdateDealModel>(
        {
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
        const isValid = await trigger(['slug', 'name', 'video']); //Validate Fields in Deal
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
                            <label htmlFor="slug">Slug</label>
                            <input
                            readOnly
                            id="slug"
                                className='text_input'
                                placeholder='Slug...'
                                {...register("slug", {
                                    required: true,
                                })}
                            />
                            {errors?.slug?.type === "required" && (
                                <p className='error_msg'>Slug is required !</p>
                            )}
                            <label htmlFor="name">Name</label>
                            <input
                                className='text_input'
                                id="name"
                                placeholder='Name...'
                                {...register("name", {
                                    required: true,
                                    pattern: /^[A-Za-z\s]+$/i
                                })}
                            />
                            {errors?.name?.type === "required" && (
                                <p className='error_msg'>Name is required !</p>
                            )}
                            {errors?.name?.type === "pattern" && <p className='error_msg'>Alphabetical characters only !</p>}
                            
                            <label htmlFor="name">Video</label>
                            <input
                                className='text_input'
                                placeholder='Video URL...'
                                {...register("video", {
                                    required: false,
                                    pattern: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/
                                })}
                            />
                            {errors?.video?.type === "pattern" && (
                                <p className='error_msg'>URL links only !</p>
                            )}

                            {watch('image')?<img width={300} src={`${API}/${watch('image')}`}/>:<p>No Image to View</p>}                        

                            <span><b>Update the Image</b></span>
                            <input
                                type='file'
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null
                                    // setImageFile(file);
                                    // if(file){
                                    //     setImageLink(`${URL.createObjectURL(file)}`);
                                    // }
                                }}
                            />

                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Link href={'/dashboard/deals'}>
                                    <Button variant="outlined" className='px-4'>Back</Button>
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
                                            
                                            <input
                                                className='text_input'
                                                placeholder='Hotel Name...'
                                                {...register(`hotels.${index}.name`, {
                                                    required: true,
                                                    pattern: /^[A-Za-z]+$/i
                                                })}
                                            />
                                            {errors?.hotels?.[index]?.name?.type === "required" && (
                                                <p className='error_msg'>Hotel Name is required !</p>
                                            )}
                                            {errors?.hotels?.[index]?.name?.type === "pattern" && (
                                                <p className='error_msg'>Alphabetical characters only !</p>
                                            )}

                                            <input
                                                step='0.1'
                                                className='text_input'
                                                type='number'
                                                placeholder='Rate...'
                                                {...register(`hotels.${index}.rate`, {
                                                    required: true,
                                                    min: 0,
                                                    max: 1,
                                                })}
                                            />
                                            {errors?.hotels?.[index]?.rate?.type === "required" && (
                                                <p className='error_msg'>Rate is required !</p>
                                            )}
                                            {(errors?.hotels?.[index]?.rate?.type === "max" || errors?.hotels?.[index]?.rate?.type === "min") && (
                                                <p className='error_msg'>Rate is a number between 0 and 1 !</p>
                                            )}

                                            <input
                                                className='text_input'
                                                placeholder='Amenities...'
                                                {...register(`hotels.${index}.amenities`, {
                                                    required: true,
                                                    pattern: /^(\w+(,\s*\w+)*)?$/
                                                })}
                                            />
                                            {errors?.hotels?.[index]?.amenities?.type === "required" && (
                                                <p className='error_msg'>Amenities is required !</p>
                                            )}
                                            {errors?.hotels?.[index]?.amenities?.type === "pattern" && (
                                                <p className='error_msg'>Comma-separated list of amenities only !</p>
                                            )}
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