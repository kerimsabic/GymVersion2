import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL,  } from "@/shared/data";
import { Attendance, Member, Membership, Trainer, TrainingPlan } from "@/shared/types";





export const membersApi = createApi({
    reducerPath: 'membersApi',
    baseQuery: (args, api:any, extraOptions) => {
        const { userToken } = api.getState().auth; // Assuming the auth slice has userToken
        const headers: any = {};
        if (userToken) {
            headers['authorization'] = `Bearer ${userToken}`;
        }
       /* const headers = {
          'authorization':`Bearer ${userToken}`
        };  */  
        return fetchBaseQuery({
          baseUrl: BASE_URL,
          headers,
        })(args, api, extraOptions);
      },
    tagTypes: ["membersApi"],
    endpoints: (builder) => ({
        
        getUserToken: builder.query<Member | Trainer, string>({
            query: (token) => `/users/token/${token}`,
            providesTags: (_result, _error, token) => [{ type: "membersApi", token }],
        }),
        
        addMember: builder.mutation({
            query: (data) => ({
                url: "/auth/registerMember",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["membersApi"],
        }),
        getMemberId: builder.query<Member, string>({
            query: (id) => `/members/${id}`,
            providesTags: (_result, _error, id) => [{ type: "membersApi", id }],
        }),

        getMemberMembership: builder.query<Membership, string>({
            query: (id) => `/memberships/member/${id}`,
            providesTags: (_result, _error, id) => [{ type: "membersApi", id }],
        }),
        
        updateMember: builder.mutation({
            query: ({ id, data }) => ({
                url: `/members/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["membersApi"],
        }),
        updateMemberPassword: builder.mutation({
            query: ({ id, data }) => ({
                url: `/members/changePassword/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["membersApi"],
        }),
        updateMemberMembershipSpecial: builder.mutation({
            query: ({ id, data }) => ({
                url: `/members/membership/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["membersApi"],
        }),

        renewMembership: builder.mutation({
            query: ({ id }) => ({
                url: `/members/renewMembership/${id}`,
                method: "PUT",
                
            }),
            invalidatesTags: ["membersApi"],
        }),

        getMemberAttendance: builder.query<Attendance[], string>({
            query: (id) => `/attendance/memberAttendance/${id}`,
            providesTags: (_result, _error, id) => [{ type: "membersApi", id }],
        }),

        getTrainingPlan: builder.query<TrainingPlan, string>({
            query: (id) => `/trainingPlans/${id}`,
            providesTags: (_result, _error, id) => [{ type: "membersApi", id }],
        }),

        updateMembershipStripe: builder.mutation({
            query: ({ data }) => ({
                url: `/payment/payment`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["membersApi"],
        }),
        updateMembershipStripeRegister: builder.mutation({
            query: ({ data }) => ({
                url: `/payment/paymentOnRegister`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["membersApi"],
        }),
        getTrainers : builder.query<any[], void>({
            query: () => "/users/trainers",
            providesTags: ["membersApi"],
        }),
        setTrainer: builder.mutation<void, { memberId: string | any; trainerId: string }>({
            query: ({ memberId, trainerId }) => ({
                url: `/members/setTrainer/${memberId}/${trainerId}`,
                method: "PUT",
            }),
            invalidatesTags: ["membersApi"],
        }),
        removeTrainer: builder.mutation<void, { memberId: string | any}>({
            query: ({ memberId }) => ({
                url: `/members/removeTrainer/${memberId}`,
                method: "PUT",
            }),
            invalidatesTags: ["membersApi"],
        }),
        uploadImage: builder.mutation<string, { file: File | any, memberId: string| any }>({
            query: ({ file, memberId }) => {
                const formData = new FormData();
                formData.append('image', file);
                return {
                    url: `/users/uploadImageAzure/${memberId}`,
                    method: "POST",
                    body: formData,
                };
            },
            transformResponse: (response: string) => response,
          
            invalidatesTags: ["membersApi"],
        }),
        
    })
})



// Export hooks for usage in components
export const {useAddMemberMutation, useUpdateMemberMutation, useGetMemberIdQuery, useUpdateMemberMembershipSpecialMutation, 
    useGetUserTokenQuery, useUpdateMemberPasswordMutation, useGetMemberAttendanceQuery, 
    useGetMemberMembershipQuery, useGetTrainingPlanQuery, useRenewMembershipMutation, 
    useUpdateMembershipStripeMutation, useGetTrainersQuery, useSetTrainerMutation, 
    useRemoveTrainerMutation, useUploadImageMutation, useUpdateMembershipStripeRegisterMutation } = membersApi;


export default membersApi;