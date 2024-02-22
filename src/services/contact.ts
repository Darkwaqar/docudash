// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { api } from './api';

export interface Contact {
  id: number;
  name: string;
  email: string;
}

type ContactsResponse = {
  data: Contact[];
};

type EditContactResponse = {
  data: Contact;
};

export const postApi = api.injectEndpoints({
  endpoints: (build) => ({
    getContacts: build.query<ContactsResponse['data'], void>({
      query: () => 'Contacts/list',
      // Provides a list of `Contacts` by `id`.
      // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Contacts` element was added.
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'Contacts', id } as const)),
              { type: 'Contacts', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Contacts', id: 'LIST' }` is invalidated
            [{ type: 'Contacts', id: 'LIST' }],
      transformResponse: (returnValue: ContactsResponse) => {
        return returnValue.data;
      },
    }),
    addContact: build.mutation<Contact, Partial<Contact>>({
      query(body) {
        return {
          url: `Contacts/create`,
          method: 'POST',
          body,
        };
      },
      transformResponse: (returnValue: EditContactResponse) => {
        return returnValue.data;
      },
      // Invalidates all Contact-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created addresses could show up in any lists.
      invalidatesTags: [{ type: 'Contacts', id: 'LIST' }],
    }),
    getContact: build.query<EditContactResponse['data'], number>({
      query: (id) => `Contacts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Contacts', id }],
      transformResponse: (returnValue: EditContactResponse) => {
        return returnValue.data;
      },
    }),
    updateContact: build.mutation<Contact, Partial<Contact>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `Contacts/update/${id}`,
          method: 'Post',
          body,
        };
      },
      transformResponse: (returnValue: EditContactResponse) => {
        return returnValue.data;
      },
      // Invalidates all queries that subscribe to this Contact `id` only.
      // In this case, `getContact` will be re-run. `getContacts` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [{ type: 'Contacts', id }],
    }),
    deleteContact: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `Contacts/delete`,
          method: 'Post',
          params: { deleteId: id },
        };
      },
      // Invalidates all queries that subscribe to this Contact `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'Contacts', id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetContactsQuery,
  useAddContactMutation,
  useGetContactQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = postApi;
