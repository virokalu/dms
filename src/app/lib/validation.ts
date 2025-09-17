import * as yup from "yup";
import { CreateDealModel } from "./definitions";

const dealSchema: yup.ObjectSchema<CreateDealModel>  = yup.object({
  slug: yup.string().required("Slug is required"),
  name: yup.string().required("Name is required"),
  hotels: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Hotel name is required"),
        rate: yup
          .number()
          .typeError("Rate is a number between 0 and 1")
          .min(0)
          .max(1)
          .required("Rate is required"),
        amenities: yup.string().required("Amenities is required"),
        medias: yup
          .array()
          .of(
            yup.object({
              fieldId: yup.string().required(),
              mediaFile: yup.mixed<File>().nullable().optional().notRequired(),
              alt: yup.string().required("Media Alt is required"),
              path: yup.string().required(),
              isVideo: yup.bool().required(),
            })
          )
          .min(1, "At least one Media required")
          .required(),
      })
    )
    .min(1, "At least one Hotel required")
    .required(),
  video: yup
    .object()
    .shape({
      alt: yup.string().required(),
      path: yup.string().required(),
    }).required(),
  imageFile: yup.mixed<File>().nullable().optional().notRequired(),
  videoFile: yup.mixed<File>().nullable().optional().notRequired(),
  image: yup.string().required(),
});

const dealUpdateSchema: yup.ObjectSchema<CreateDealModel>  = yup.object({
  slug: yup.string().required("Slug is required"),
  name: yup.string().required("Name is required"),
  hotels: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Hotel name is required"),
        rate: yup
          .number()
          .typeError("Rate is a number between 0 and 1")
          .min(0)
          .max(1)
          .required("Rate is required"),
        amenities: yup.string().required("Amenities is required"),
        medias: yup
          .array()
          .of(
            yup.object({
              fieldId: yup.string().required(),
              mediaFile: yup.mixed<File>().required().nullable(),
              alt: yup.string().required("Media Alt is required"),
              path: yup.string().required(),
              isVideo: yup.bool().required(),
            })
          )
          .min(1, "At least one Media required")
          .required(),
      })
    )
    .min(1, "At least one Hotel required")
    .required(),
  video: yup
    .object()
    .shape({
      alt: yup.string().required(),
      path: yup.string().required(),
    }).required(),
  imageFile: yup.mixed<File>().nullable().optional().notRequired(),
  videoFile: yup.mixed<File>().nullable().optional().notRequired(),
  image: yup.string().required(),
});

export default dealSchema;
