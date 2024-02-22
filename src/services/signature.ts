// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { SignaturesListAPI } from 'src/types/signatureList';
import { api } from './api';

export interface Signature {
  id: number;
  name: string;
  signature: string;
  initial: string;
  status: boolean | number;
}

type SignaturesResponse = {
  data: Signature[];
};

type EditSignatureResponse = {
  data: Signature;
};

export const postApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSignatures: build.query<SignaturesListAPI['data'], void>({
      query: () => 'signatures/list',
      // Provides a list of `Signatures` by `id`.
      // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Signatures` element was added.
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'Signatures', id } as const)),
              { type: 'Signatures', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Signatures', id: 'LIST' }` is invalidated
            [{ type: 'Signatures', id: 'LIST' }],
      transformResponse: (returnValue: SignaturesListAPI) => {
        return returnValue.data.map((x) => {
          return {
            ...x,
            signature: x.signature.replace(/(\r\n|\n|\r)/gm, ''),
            initial: x.initial.replace(/(\r\n|\n|\r)/gm, ''),
          };
        });
      },
    }),
    addSignature: build.mutation<Signature, Partial<Signature>>({
      query(body) {
        return {
          url: `signatures/create`,
          method: 'POST',
          body,
        };
      },
      transformResponse: (returnValue: EditSignatureResponse) => {
        return returnValue.data;
      },
      // Invalidates all Signature-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created Signatures could show up in any lists.
      invalidatesTags: [{ type: 'Signatures', id: 'LIST' }],
    }),
    updateStatus: build.mutation<Signature, Partial<Signature>>({
      query(body) {
        // console.log('updateStatus', body);

        return {
          url: `signatures/statusUpdate`,
          method: 'POST',
          body,
        };
      },
      transformResponse: (returnValue: EditSignatureResponse) => {
        return returnValue.data;
      },
      // Invalidates all Signature-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created Signatures could show up in any lists.
      invalidatesTags: (result, error, { id }) => [{ type: 'Signatures', id }],
    }),
    getSignature: build.query<EditSignatureResponse['data'], number>({
      query: (id) => `Signatures/${id}`,
      providesTags: (result, error, id) => [{ type: 'Signatures', id }],
      transformResponse: (returnValue: EditSignatureResponse) => {
        return returnValue.data;
      },
    }),
    updateSignature: build.mutation<Signature, Partial<Signature>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `Signature/update/${id}`,
          method: 'Post',
          body,
        };
      },
      transformResponse: (returnValue: EditSignatureResponse) => {
        return returnValue.data;
      },
      // Invalidates all queries that subscribe to this Signature `id` only.
      // In this case, `getSignature` will be re-run. `getSignatures` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [{ type: 'Signatures', id }],
    }),
    deleteSignature: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `signatures/delete`,
          method: 'Post',
          params: { deleteId: id },
        };
      },
      // Invalidates all queries that subscribe to this Signature `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'Signatures', id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSignaturesQuery,
  useAddSignatureMutation,
  useGetSignatureQuery,
  useUpdateSignatureMutation,
  useDeleteSignatureMutation,
  useUpdateStatusMutation,
} = postApi;
