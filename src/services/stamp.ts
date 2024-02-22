// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { StampListAPI } from '@type/*';
import { api } from './api';

export interface Stamp {
  id: number;
  name: string;
  stamp: string;
  initial: string;
  status: boolean | number;
}

type StampsResponse = {
  data: { data: Stamp[] };
};

type EditStampResponse = {
  data: Stamp;
};

export const stampApi = api.injectEndpoints({
  endpoints: (build) => ({
    getStamps: build.query<StampListAPI['data'], number | undefined>({
      query: (page) => {
        console.log('loadmore', { page });
        return {
          url: `stamps?page=${page}`,
          method: 'get',
          // params: { page },
        };
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems, { arg }) => {
        if (arg == 1) {
          return newItems;
        }
        currentCache.data.push(...newItems.data);
        currentCache.next_page_url = newItems.next_page_url;
        return currentCache;
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      // Provides a list of `Stamps` by `id`.
      // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Stamps` element was added.
      // providesTags: (result) =>
      //   // is result available?
      //   result
      //     ? // successful query
      //       [
      //         ...result.map(({ id }) => ({ type: 'Stamps', id } as const)),
      //         { type: 'Stamps', id: 'LIST' },
      //       ]
      //     : // an error occurred, but we still want to refetch this query when `{ type: 'Stamps', id: 'LIST' }` is invalidated
      //       [{ type: 'Stamps', id: 'LIST' }],
      transformResponse: (returnValue: StampListAPI) => {
        console.log(returnValue);
        return returnValue.data;
      },
    }),
    addStamp: build.mutation<Stamp, Partial<Stamp>>({
      query(body) {
        return {
          url: `stamps/create`,
          method: 'POST',
          body,
        };
      },
      transformResponse: (returnValue: EditStampResponse) => {
        return returnValue.data;
      },
      // Invalidates all Stamp-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created Stamps could show up in any lists.
      invalidatesTags: [{ type: 'Stamps', id: 'LIST' }],
    }),
    updateStampStatus: build.mutation<Stamp, Partial<Stamp>>({
      query(body) {
        return {
          url: `stamps/statusUpdate`,
          method: 'POST',
          body,
        };
      },
      // Invalidates all Stamp-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created Stamps could show up in any lists.
      invalidatesTags: (result, error, body) => [{ type: 'Stamps', id: body.id }],
    }),
    getStamp: build.query<EditStampResponse['data'], number>({
      query: (id) => `Stamps/${id}`,
      providesTags: (result, error, id) => [{ type: 'Stamps', id }],
      transformResponse: (returnValue: EditStampResponse) => {
        return returnValue.data;
      },
    }),
    updateStamp: build.mutation<Stamp, Partial<Stamp>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `Stamp/update/${id}`,
          method: 'Post',
          body,
        };
      },
      transformResponse: (returnValue: EditStampResponse) => {
        return returnValue.data;
      },
      // Invalidates all queries that subscribe to this Stamp `id` only.
      // In this case, `getStamp` will be re-run. `getStamps` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [{ type: 'Stamps', id }],
    }),
    deleteStamp: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `stamps/delete`,
          method: 'Post',
          params: { deleteId: id },
        };
      },
      // Invalidates all queries that subscribe to this Stamp `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'Stamps', id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetStampsQuery,
  useAddStampMutation,
  useGetStampQuery,
  useUpdateStampMutation,
  useDeleteStampMutation,
  useUpdateStampStatusMutation,
} = stampApi;
