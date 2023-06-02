# Docudash

# Steps:

1. use npx create-expo-app -t expo-template-blank-typescript this will init the project in typescript

2. add the web support `npx expo install react-dom react-native-web @expo/webpack-config`

3. add React Navigation both native and stack `yarn add @react-navigation/native @react-navigation/stack @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer @react-navigation/material-top-tabs react-native-tab-view`

4. add expo react navigation dependencies and add gesture handle `npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler`

- make sure to add this code in index.js or App.js: at the top

```
import 'react-native-gesture-handler';
```

5. add tailwind class name library `yarn add twrnc`

6. add tailwind config file for autocomplete add style to the class name in tailwind autocomplete `npx tailwindcss init`

7. add firebase to the project `yarn add @react-native-firebase/firestore @react-native-firebase/auth @react-native-firebase/app @react-native-google-signin/google-signin`

- in app.json

```
"ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "supportsTablet": true,
      "bundleIdentifier": "host.exp.exponent"
    },
     "android": {
      "googleServicesFile": "./google-services.json",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "host.exp.exponent"
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-google-signin/google-signin",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ]
```

8. add expo build properties `yarn add expo-build-properties`
9. use command to clean and add to android and ios `npx expo prebuild --clean`
10. run build with `npx expo run:ios`

11. add react native paper `yarn add react-native-paper`
12. add react native paper alert `yarn add react-native-paper-alerts`

13. add localization `yarn add i18n-js@3.8.0 react-native-localize@2.2.0`
14. add type of i18n-js `yarn add @types/i18n-js@3.8.2`

15. add google analytics `yarn add @react-native-firebase/analytics`

16. add country picker `yarn add react-native-country-picker-modal`

17. add lib phone number `yarn add libphonenumber-js`

18. add signature view `yarn add react-native-signature-canvas`

- add react native webview as its the dependency use `npx expo install react-native-webview`

20. add file picker
    `npx expo install expo-document-picker `

21. add mime type
    `yarn add react-native-mime-types`

22. at moment.js for the time
    `yarn add moment`

23. add react native maps
    `npx expo install react-native-maps`

24. create .env file and save the key there

25. add react native dotenv to project `yarn add react-native-dotenv`

26. add google place autoComplete `yarn add react-native-google-places-autocomplete`

27. add rating star
    `yarn add react-native-star-rating-widget`

28. add react native svg
    `npx expo install react-native-svg`

29. add pdf lib
    `yarn add pdf-lib`

30. add video call library
    `yarn add react-native-voximplant@latest`

- Run the expo command using Rosetta -> `arch -x86_64 npx expo run:ios`

31. add new sanario to the vox

```
VoxEngine.addEventListener(AppEvents.CallAlerting ,(e)=>{
    const newCall = VoxEngine.callUserDirect(
        e.call,
        e.destination,
        e.callerid,
        e.displayName,
        null
    )
    VoxEngine.easyProcess(e.call,newCall,()=>{},true)
})
```

31. go to routing the the vox admin and add new rule/

32. add react native pdf
    `yarn add react-native-pdf react-native-blob-util`
33. add react native calender
    `yarn add react-native-calendars`

34. add react native storage to save data
    `yarn add @react-native-async-storage/async-storage@1.17.11`

35. https://expo.dev/register-device/62f7d54f-d8c6-4e2f-93a0-868db0491055
    n

36. add react native drag and resize for signature
    `yarn add react-native-drag-resize`

37. add font to the system
    `npx expo install expo-font`
