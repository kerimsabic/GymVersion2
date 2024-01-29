import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL,  } from "@/shared/data";
import { Member, Trainer } from "@/shared/types";





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
        getMembers: builder.query<Member[], void>({
            query: () => "/members/",
            providesTags: ["membersApi"],
        }),
        getUserToken: builder.query<Member | Trainer, string>({
            query: (token) => `/users/token/${token}`,
            providesTags: (_result, _error, token) => [{ type: "membersApi", token }],
        }),
        getOnlineMembers: builder.query<Member[], void>({
            query: () => "/members/online",
            providesTags: ["membersApi"],
        }),
        getOfflineMembers: builder.query<Member[], void>({
            query: () => "/members/offline",
            providesTags: ["membersApi"],
        }),
        getMemberPagin: builder.query<Member[], number | void>({
            query: () => `/members/pagination/?page=0&pageSize=6`, // Set pageSize to 6
            providesTags: ["membersApi"],
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
                url: `/members/password/${id}`,
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
        deleteMember: builder.mutation({
            query: ({ id }) => ({ url: `/members/${id}`, method: "DELETE" }),
            invalidatesTags: ["membersApi"],
        }),
    })
})



// Export hooks for usage in components
export const { useGetMembersQuery, useAddMemberMutation, useUpdateMemberMutation, useDeleteMemberMutation, useGetMemberIdQuery, useGetMemberPaginQuery, useGetOfflineMembersQuery, useGetOnlineMembersQuery, useUpdateMemberMembershipSpecialMutation, useGetUserTokenQuery, useUpdateMemberPasswordMutation } = membersApi;


export default membersApi;