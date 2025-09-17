'use client'
import { Box, Button, Grid, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'
import Link from 'next/link';
import { createDeal } from '@/app/lib/action';
import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Notify from '@/app/ui/notify';
import React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

const steps = ['Add Deal Details', 'Add Hotels'];

import { CreateDealModel, Media } from '@/app/lib/definitions';
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
    const [mediaList, setmediaList] = useState<Media[]>([]);


    const handleNext = async () => {
        const isValid = await trigger(['slug', 'name', 'video.path', 'image', 'video.alt'], { shouldFocus: true }); // fields for step 1
        // console.log(imageFile?.name);

        if (isValid)
            setActiveStep((prev) => prev + 1);
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
            hotel.medias.forEach((media, mediaIndex) => {
                const mediaFile: File = mediaList.find(item => item.fieldId == media.fieldId)?.mediaFile!;
                formData.append(`hotels[${index}].medias[${mediaIndex}].alt`, media.alt);
                formData.append(`hotels[${index}].medias[${mediaIndex}].mediaFile`, mediaFile)
            })
        });
        startTransition(() => {
            createDealAction(formData);
        })
        // console.log(data);
        // console.log(mediaList);
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
                    {
                        name: '', rate: 0, amenities: '', medias: [{
                            fieldId: '',
                            mediaFile: null,
                            alt: '',
                            path: ''
                        }],
                    }
                ]
            }
        }
    );

    const { fields, append, remove } = useFieldArray({
        control,
        name: "hotels",
    });

    // Media File Handle
    const mediaRef = useRef<Record<string, any>>({});

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>, hotelIndex: number, fieldId: string) => {
        const files = Array.from(e.target.files || []);
        // console.log(files.length);
        const newMedia = files.map((file, i) => {
            const id = `${Date.now()}-${i}`;
            const path = URL.createObjectURL(file);

            return {
                fieldId: id,
                mediaFile: file,
                alt: "",
                path,
                isVideo: file.type.startsWith('video/'),
            } as Media;
        });

        setmediaList(prev => [...prev, ...newMedia]);
        // console.log(newMedia.length)

        newMedia.forEach((media, i) => {

            const count = mediaRef.current[fieldId]?.mediaFieldsCreate?.length;

            mediaRef.current[fieldId]?.mediaAppend(
                {
                    id: '0',
                    fieldId: '',
                    mediaFile: null,
                    alt: '',
                    path: media.path,
                    isUpdated: true,
                    isVideo: media.isVideo,

                }
            );
        
            // console.log(i)
            setValue(`hotels.${hotelIndex}.medias.${count + i}.path`, media.path);
            setValue(`hotels.${hotelIndex}.medias.${count + i}.fieldId`, media.fieldId);
            setValue(`hotels.${hotelIndex}.medias.${count + i}.isVideo`, media.isVideo);

            // mediaRef.current[fieldId]?.mediaAppend();
        });
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
                            <Box sx={{
                                display: 'flex',
                                flexDirection: {
                                    xs: 'column',
                                    sm: 'row'
                                },
                                // alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 8
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2

                                }}>
                                    {watch('video.path') ? <video autoPlay width={300} src={watch('video.path')} /> : <p>No Video to View</p>}

                                    <label htmlFor="video-upload">
                                        <Button variant="outlined" component="span">
                                            Upload Video
                                        </Button>
                                    </label>
                                    <input
                                        id="video-upload"
                                        type="file"
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            setVideoFile(file ?? null);
                                            if (file) {
                                                setValue('video.path', URL.createObjectURL(file));
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


                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2

                                }}>
                                    {watch('image') ? <img width={300} src={watch('image')} /> : <p>No Image to View</p>}
                                    <label htmlFor="image-upload">
                                        <Button variant="outlined" component="span">
                                            Upload Image
                                        </Button>
                                    </label>
                                    <input type='file'
                                        id='image-upload'
                                        accept='image/*'
                                        style={{ display: 'none' }}
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
                                </Box>
                            </Box>

                            {/* <Typography sx={{ pt: 4 }} variant="h6">New Video</Typography>

                            <Box sx={{
                                borderWidth: 1,
                                borderRadius: 5,
                                borderColor: '#bdbdbd',
                                padding: 5,
                                marginBottom: 4,
                                gap: '16px'
                            }}>
                                <Stack spacing={4}>
                                    
                                    
                                </Stack>
                            </Box> */}

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

                                            <Typography variant="h6">New Media</Typography>
                                            <MediasArray 
                                                key={field.id}
                                                ref={(ref) => {
                                                    if (ref) mediaRef.current[field.id] = ref;
                                                }}
                                                // ref={mediaRef} 
                                                nestIndex={index} {...{ control, register, errors, watch, setValue, setmediaList }} />

                                            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                                <label htmlFor={`medias-upload${index}`} >
                                                    <Button variant='outlined' component="span" >Upload Media</Button>
                                                </label>
                                                <input
                                                    accept='video/*, image/*'
                                                    id={`medias-upload${index}`}
                                                    multiple
                                                    type='file'
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFiles(e, index, field.id)}
                                                />
                                                <Box sx={{ flex: '1 1 auto' }} />
                                                <Box sx={{
                                                    display: 'flex',
                                                    gap: 2,
                                                    flexDirection: {
                                                        sm: 'row',
                                                        xs: 'column'
                                                    }
                                                }}>
                                                    {index == fields.length - 1 ? <Button variant="outlined" onClick={() => append({
                                                        name: '', rate: 0, amenities: '', medias: [{
                                                            fieldId: '',
                                                            mediaFile: null,
                                                            alt: '',
                                                            path: '',
                                                            isVideo: false,
                                                        }]
                                                    })}>Add Hotel</Button> : null}
                                                    {fields.length > 1 ? <Button sx={{ ml: 2 }} variant="outlined" color='warning' onClick={() => remove(index)}>Remove Hotel {index + 1}</Button> : null}
                                                </Box>
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