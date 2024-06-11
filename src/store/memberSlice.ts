import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL,  } from "@/shared/data";
import { Attendance, Member, Membership, Trainer, TrainingPlan } from "@/shared/types";





export const membersApi = createApi({
    reducerPath: 'membersApi',
    baseQuery: (args, api:any, extraOptions) => {
        const { userToken } = api.getState().auth; // Assuming the auth slice has userToken
        const headers = {
          'authorization':`Bearer ${userToken}`
        };    
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
        
    })
})



// Export hooks for usage in components
export const {useAddMemberMutation, useUpdateMemberMutation, useGetMemberIdQuery, useUpdateMemberMembershipSpecialMutation, useGetUserTokenQuery, useUpdateMemberPasswordMutation, useGetMemberAttendanceQuery, useGetMemberMembershipQuery, useGetTrainingPlanQuery, useRenewMembershipMutation } = membersApi;


export default membersApi;