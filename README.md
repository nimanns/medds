# medds

![Screenshot of the app.](/Screenshot.png)

### Description:

My final project, Medds, is an Android application developed using React Native and Expo with Typescript. It is designed to take in medication names and the times throughout the week when they have to be taken so that it can notify you accordingly and after the period is done you can specify how the medication made you feel with regards to the side effects and whether it was helpful or not and then the recorded result will make the item color coded accordingly and provide a brief description for you to know which medications work for you and which ones don't.

Since I don't own any apple products I couldn't develop the iOS version so it's Android-only for now! The application uses a local SQLite database to store its data as well as AsyncStorage (for detecting the initial launch of the application) and React Context api to manage the state. The animations are made possible using the Reanimated library. The app also uses react navigation and has two pages. For managing the notification scheduling I've used Expo Notifications library, after a medication is submitted to be added into the database, the notification ids also get stored inside an array and then it gets serialized so that it can be stored inside the database and when the user is done with the medication or wants to delete it using those notification ids we can cancel all the upcoming related notifications.

The main application consists of two pages, a Home screen which is written inside the Home.tsx file and it contains the InputForm.tsx component which provides a form for the user to input the name and the times of the medication's intake. The profile page which is written inside Profile.tsx showcases the medications and their timestamps and there are components for each medication to allow the user to specify the result of its use. The main component inside the profile page is the Item.tsx which represents a medication item within the scroll view. The Item.tsx component itself contains Result.tsx and SideEffects.tsx components which are for taking input on the result of the medication. The Result.tsx and SideEffects.tsx components themselves make use of Option.tsx component which is a more customizable RadioButton.tsx clone. There is also an intro page (Intro.tsx) to introduce the app and how it works upon the inital launch.

I have custom made all the buttons and radio switches within the application. The ButtonComp.tsx contains code that makes up the custom cyan gradient buttons of the UI and the RadioButton.tsx contains the code for week day radio buttons. For achieving the gradient effect I've used a library called react native linear gradient.

There are also some minor visual components like PillsSVG.tsx and BackgroundGradient.tsx which provide some of the visual aspects of the application.

Inside the lib folder there are two files, Dimensions.tsx which calculated and exports the dimensions of the device's screen so that it can be used throughout the application without recalculating, Types.d.ts also declares some types which resemble the data structure of the medication items stored inside the database.

Finally the assets folder contains some custom designed icons for the main icon of the app itself and the icon for the notification badge.
