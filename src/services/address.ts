// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { api } from './api';

export interface Address {
  id: number;
  name: string;
}

type AddressesResponse = {
  data: Address[];
};

type EditAddressResponse = {
  data: Address;
};

export const postApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAddresses: build.query<AddressesResponse['data'], void>({
      query: () => 'Address',
      // Provides a list of `Addresses` by `id`.
      // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Addresses` element was added.
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'Addresses', id } as const)),
              { type: 'Addresses', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Addresses', id: 'LIST' }` is invalidated
            [{ type: 'Addresses', id: 'LIST' }],
      transformResponse: (returnValue: AddressesResponse) => {
        return returnValue.data;
      },
    }),
    addAddress: build.mutation<Address, Partial<Address>>({
      query(body) {
        return {
          url: `Address/create`,
          method: 'POST',
          body,
        };
      },
      transformResponse: (returnValue: EditAddressResponse) => {
        return returnValue.data;
      },
      // Invalidates all Address-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created addresses could show up in any lists.
      invalidatesTags: [{ type: 'Addresses', id: 'LIST' }],
    }),
    getAddress: build.query<EditAddressResponse['data'], number>({
      query: (id) => `addresses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Addresses', id }],
      transformResponse: (returnValue: EditAddressResponse) => {
        return returnValue.data;
      },
    }),
    updateAddress: build.mutation<Address, Partial<Address>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `Address/update/${id}`,
          method: 'Post',
          body,
        };
      },
      transformResponse: (returnValue: EditAddressResponse) => {
        return returnValue.data;
      },
      // Invalidates all queries that subscribe to this Address `id` only.
      // In this case, `getAddress` will be re-run. `getAddresses` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [{ type: 'Addresses', id }],
    }),
    deleteAddress: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `Address/delete`,
          method: 'Post',
          params: { deleteId: id },
        };
      },
      // Invalidates all queries that subscribe to this Address `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'Addresses', id }],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useGetAddressQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = postApi;
