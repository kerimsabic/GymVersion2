import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL,  } from "@/shared/data";
import { Member, Trainer, TrainingPlan } from "@/shared/types";





export const plansApi = createApi({
    reducerPath: 'plansApi',
    baseQuery: (args, api:any, extraOptions) => {  
        return fetchBaseQuery({
          baseUrl: BASE_URL,  
        })(args, api, extraOptions);
      },
    tagTypes: ["plansApi"],
    endpoints: (builder) => ({
        getPlans: builder.query<TrainingPlan[], void>({
            query: () => "/trainingPlans/",
            providesTags: ["plansApi"],
        }),
        getUserToken: builder.query<Member | Trainer, string>({
            query: (token) => `/users/token/${token}`,
            providesTags: (_result, _error, token) => [{ type: "plansApi", token }],
        }),
        getPlanId: builder.query<TrainingPlan, string>({
            query: (id) => `/trainingPlans/${id}`,
            providesTags: (_result, _error, id) => [{ type: "plansApi", id }],
        }),
        
    })
})



// Export hooks for usage in components
export const { useGetPlansQuery, useGetPlanIdQuery, useGetUserTokenQuery } = plansApi;


export default plansApi;