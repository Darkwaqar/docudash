import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { Divider, IconButton, Menu, Text, TextInput } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import DropDown from 'react-native-paper-dropdown';
import { IRequest } from 'src/types/request';

interface recipient {
  id: number;
  first_name: string;
  email: string;
  showDropDown: boolean;
  time: string;
}

const status = [
  {
    label: 'Needs to sign',
    value: '1',
  },
  {
    label: 'In person signer',
    value: '2',
  },
  {
    label: 'Receives a copy',
    value: '3',
  },
  {
    label: 'Needs to view',
    value: '4',
  },
];

export default function RequestRecipient({
  data,
  setData,
}: {
  data: IRequest;
  setData: React.Dispatch<React.SetStateAction<IRequest>>;
}) {
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      Recipients: [...new Array(data.numOfRecipients)].map((x, i) => ({
        id: String(i),
        recName: '',
        recEmail: '',
        sign_type: '1',
        hostName: '',
        hostEmail: '',
        access_code: '',
        private_message: '',
        recipients_update_id: '',
        showDropDown: false,
        visible: false,
        showAccessCode: false,
        showPrivateMessage: false,
      })),
    }));
  }, [data.numOfRecipients]);

  const Delete = (id) => {
    setData((prev) => ({
      ...prev,
      Recipients: prev.Recipients.filter((x, index) => index != id),
      numOfRecipients: prev.numOfRecipients - 1,
    }));
  };

  return (
    <>
      <View style={tw` mx-2`}>
        <Text variant="labelLarge">Number of Recipients:</Text>
        <TextInput
          mode="outlined"
          value={String(data.numOfRecipients)}
          onChangeText={(text) =>
            setData((prev) => ({
              ...prev,
              numOfRecipients: Number(text.replace(/[^0-9]/g, '')),
            }))
          }
        />
      </View>
      <ScrollView nestedScrollEnabled>
        <View style={tw` gap-2`}>
          {data.Recipients?.map((item) => (
            <View style={tw`h-50`} key={item.id}>
              <View style={tw`border-2  border-gray-300 p-4 flex-row flex-1 items-center gap-4`}>
                <Text>{Number(item.id) + 1}</Text>

                <View style={tw`gap-2 flex-1`}>
                  {item.sign_type == '2' ? (
                    <>
                      <View style={tw`flex-row items-center`}>
                        <Text variant="labelLarge" style={tw`w-15`}>
                          Host name:
                        </Text>
                        <TextInput
                          mode="outlined"
                          style={tw`ml-2 flex-1`}
                          // placeholder="Name"
                          value={item.hostName}
                          onChangeText={(text) =>
                            setData((prev) => ({
                              ...prev,
                              Recipients: prev.Recipients.map((x) =>
                                x.id == item.id ? { ...x, hostName: text } : x
                              ),
                            }))
                          }
                        ></TextInput>
                      </View>

                      <View style={tw`flex-row items-center`}>
                        <Text variant="labelLarge" style={tw`w-15`}>
                          Host email:
                        </Text>
                        <TextInput
                          mode="outlined"
                          style={tw`ml-2 flex-1`}
                          // placeholder="Name"
                          value={item.hostEmail}
                          onChangeText={(text) =>
                            setData((prev) => ({
                              ...prev,
                              Recipients: prev.Recipients.map((x) =>
                                x.id == item.id ? { ...x, hostEmail: text } : x
                              ),
                            }))
                          }
                        ></TextInput>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={tw`flex-row items-center`}>
                        <Text variant="labelLarge" style={tw`w-15`}>
                          Receiver Name:
                        </Text>
                        <TextInput
                          mode="outlined"
                          // placeholder="Email"
                          style={tw`ml-2 flex-1`}
                          value={item.recName}
                          onChangeText={(text) =>
                            setData((prev) => ({
                              ...prev,
                              Recipients: prev.Recipients.map((x) =>
                                x.id == item.id ? { ...x, recName: text } : x
                              ),
                            }))
                          }
                        ></TextInput>
                      </View>
                      <View style={tw`flex-row items-center`}>
                        <Text variant="labelLarge" style={tw`w-15`}>
                          Receiver Email:
                        </Text>
                        <TextInput
                          mode="outlined"
                          // placeholder="Email"
                          style={tw`ml-2 flex-1`}
                          value={item.recEmail}
                          onChangeText={(text) =>
                            setData((prev) => ({
                              ...prev,
                              Recipients: prev.Recipients.map((x) =>
                                x.id == item.id ? { ...x, recEmail: text } : x
                              ),
                            }))
                          }
                        ></TextInput>
                      </View>
                    </>
                  )}
                  <View style={tw`items-center flex-row gap-2`}>
                    <Text variant="labelLarge" style={tw`w-15`}>
                      Action:
                    </Text>
                    <Menu
                      theme={{ roundness: 4 }}
                      onDismiss={() =>
                        setData((prev) => ({
                          ...prev,
                          Recipients: prev.Recipients.map((x) =>
                            x.id == item.id ? { ...x, showDropDown: false } : x
                          ),
                        }))
                      }
                      visible={item.showDropDown}
                      anchorPosition="bottom"
                      //   style={tw`w-full`}
                      anchor={
                        <TouchableOpacity
                          onPress={() =>
                            setData((prev) => ({
                              ...prev,
                              Recipients: prev.Recipients.map((x) =>
                                x.id == item.id ? { ...x, showDropDown: true } : x
                              ),
                            }))
                          }
                          style={tw`flex-row items-center border rounded-lg w-50 border-gray-500`}
                        >
                          <Text variant="bodyMedium" style={tw`flex-1 px-2`}>
                            {status.find((x) => x.value == item.sign_type).label}
                          </Text>
                          <IconButton
                            icon="chevron-down"
                            onPress={() =>
                              setData((prev) => ({
                                ...prev,
                                Recipients: prev.Recipients.map((x) =>
                                  x.id == item.id ? { ...x, showDropDown: true } : x
                                ),
                              }))
                            }
                          />
                        </TouchableOpacity>
                      }
                    >
                      {status.map((stat) => (
                        <>
                          <Menu.Item
                            style={tw`flex-1`}
                            onPress={() => {
                              setData((prev) => ({
                                ...prev,
                                Recipients: prev.Recipients.map((x) =>
                                  x.id == item.id
                                    ? { ...x, showDropDown: false, sign_type: stat.value }
                                    : x
                                ),
                              }));
                            }}
                            title={stat.label}
                          />
                          <Divider />
                        </>
                      ))}
                    </Menu>

                    <View style={tw`w-30`}>
                      <IconButton
                        icon="trash-can"
                        iconColor="red"
                        onPress={() => Delete(item.id)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
