'use client'
import { Box, Button, Grid, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'
import Link from 'next/link';
import { createDeal } from '@/app/lib/action';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Notify from '@/app/ui/notify';
import React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

const steps = ['Add Deal Details', 'Add Hotels'];

import { CreateDealModel } from '@/app/lib/definitions';
import MediasArray from '@/app/ui/deals/mediasArray';

export default function Page() {
    const [state, createDealAction] = useActionState(createDeal, {
        type: "",
        message: "",
    });

    //Handle Notification
    const router = useRouter();

    useEffect(() => {
        Notify(state.type, state.message);
        console.log(state.message)
        if (state.type == "success") {
            router.back();
        }
    }, [state, router])

    //React Stepper
    const [activeStep, setActiveStep] = React.useState(0);

    //Handle Image
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleNext = async () => {
        const isValid = await trigger(['slug', 'name', 'video.path', 'image', 'video.alt'], { shouldFocus: true }); // fields for step 1
        // console.log(imageFile?.name);

        if (isValid) setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        // setValue('imageFile', imageFile);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    //Handle Submission
    const onSubmit: SubmitHandler<CreateDealModel> = async (data) => {
        const formData = new FormData();

        formData.append("slug", data.slug);
        formData.append("name", data.name);
        formData.append('video.alt', data.video.alt);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }
        if (videoFile) {
            formData.append("videoFile", videoFile)
        }
        data.hotels.forEach((hotel, index) => {
            formData.append(`hotels[${index}].name`, hotel.name);
            formData.append(`hotels[${index}].rate`, hotel.rate.toString());
            formData.append(`hotels[${index}].amenities`, hotel.amenities);
        });
        startTransition(() => {
            createDealAction(formData);
        })
    };
    // const onError: SubmitErrorHandler<CreateDealModel> = (errors) => console.log(errors)

    //ReactHookForm Yup Validation
    const { control, register, trigger, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateDealModel>(
        {
            defaultValues: {
                slug: '',
                name: '',
                video: {
                    alt: '',
                    path: '',
                },
                imageFile: imageFile,
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
                            <input
                                className='text_input'
                                placeholder='Slug...'
                                {...register("slug", {
                                    required: true,
                                })}
                            />
                            {errors?.slug?.type === "required" && (
                                <p className='error_msg'>Slug is required !</p>
                            )}

                            <input
                                className='text_input'
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

                            {/* <input
                                className='text_input'
                                placeholder='Video URL...'
                                {...register("video", {
                                    required: false,
                                    pattern: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/
                                })}
                            />
                            {errors?.video?.type === "pattern" && (
                                <p className='error_msg'>URL links only !</p>
                            )} */}
                            {watch('image') ? <img width={300} src={watch('image')} /> : <p>No Image to View</p>}
                            <input type='file'
                                accept='image/*'
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    setImageFile(file ?? null);
                                    if (file) {
                                        setValue('image', URL.createObjectURL(file))
                                    }
                                }}
                            />
                            <input
                                hidden
                                {...register("image", {
                                    required: true,
                                })}
                            />
                            {errors?.image?.type === "required" && (
                                <p className='error_msg'>Image is required !</p>
                            )}

                            <Typography sx={{ pt: 4 }} variant="h6">New Video</Typography>

                            <Box sx={{
                                borderWidth: 1,
                                borderRadius: 5,
                                borderColor: '#bdbdbd',
                                padding: 5,
                                marginBottom: 4,
                                gap: '16px'
                            }}>
                                <Stack spacing={4}>
                                    <input
                                        className='text_input'
                                        placeholder='Alt...'
                                        {...register("video.alt", {
                                            required: true,
                                            pattern: /^[A-Za-z\s]+$/i
                                        })}
                                    />

                                    {errors?.video?.alt?.type === "required" && (
                                        <p className='error_msg'>Alt is required !</p>
                                    )}
                                    {errors?.video?.alt?.type === "pattern" && <p className='error_msg'>Alphabetical characters only !</p>}

                                    {watch('video.path') ? <video autoPlay width={300} src={watch('video.path')} /> : <p>No Video to View</p>}

                                    <input type='file'
                                        accept='video/*'
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            setVideoFile(file ?? null);
                                            if (file) {
                                                setValue('video.path', URL.createObjectURL(file))
                                            }
                                        }}
                                    />
                                    <input
                                        hidden
                                        {...register("video.path", {
                                            required: true,
                                        })}
                                    />
                                    {errors?.video?.path?.type === "required" && (
                                        <p className='error_msg'>Video is required !</p>
                                    )}
                                </Stack>
                            </Box>

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
                            <Typography sx={{ pt: 4 }} variant="h6">New Hotels</Typography>

                            <Box sx={{ pt: 2 }}>
                                {fields.map((field, index) => (
                                    <Box key={field.id} sx={{
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        borderColor: '#bdbdbd',
                                        padding: 5,
                                        marginBottom: 4,
                                    }}>
                                        <Grid container sx={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }} spacing={2} key={index}>
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
                                            
                                            <Typography variant="h6">New Medias</Typography>
                                            <MediasArray nestIndex={index} {...{control, register, errors, watch}}/>

                                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, width: '100%' }}>
                                                <Box sx={{ flex: '1 1 auto' }} />
                                                {index == fields.length - 1 ? <Button variant="outlined" onClick={() => append({
                                                    name: '', rate: 0, amenities: '', medias: [{
                                                        fieldId: '',
                                                        mediaFile: null,
                                                        alt: '',
                                                        path: ''
                                                    }], fieldId: ''
                                                })}>Add Hotel</Button> : null}
                                                {fields.length > 1 ? <Button sx={{ ml: 2 }} variant="outlined" color='warning' onClick={() => remove(index)}>Remove Hotel {index + 1}</Button> : null}
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