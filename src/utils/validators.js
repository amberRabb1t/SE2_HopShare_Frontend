import * as yup from 'yup';

/*
  Validation schemas for various forms using Yup.
  The fields correspond to form inputs and API requirements;
  they are a subset of the full data models, specifically the
  parts that the user enters through the UI.
*/

export const carSchema = yup.object({
  Seats: yup.number().integer().min(1).required('Seats required'),
  ServiceDate: yup.string().required('Service date required'),
  MakeModel: yup.string().required('Make & Model required'),
  LicensePlate: yup.string().required('License plate required')
});

export const routeSchema = yup.object({
  Start: yup.string().required('Start required'),
  End: yup.string().required('End required'),
  Stops: yup.string().required('Stops required'),
  DateAndTime: yup.string().required('Date & Time required'),
  OccupiedSeats: yup.number().integer().min(0).required('Occupied seats required'),
  Comment: yup.string().nullable()
});

export const requestSchema = yup.object({
  Start: yup.string().required('Start required'),
  End: yup.string().required('End required'),
  DateAndTime: yup.string().required('Date & Time required'),
  Description: yup.string().nullable()
});

// CHANGED: ReviewedUser replaced by ReviewedUserName (username string)
export const reviewSchema = yup.object({
  Rating: yup.number().min(0).max(5).required('Rating required'),
  UserType: yup.boolean().required('User type required'),
  Description: yup.string().nullable(),
  ReviewedUserName: yup.string().required('Target username required')
});

export const reportSchema = yup.object({
  Description: yup.string().required('Description required'),
  ReportedUser: yup.number().integer().required()
});

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password required'),
  remember: yup.boolean()
});

