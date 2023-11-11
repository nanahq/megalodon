import {
    createStackNavigator
} from "@react-navigation/stack";
import React from "react";
import { ProfileScreenName } from "@screens/AppNavigator/Screens/profile/ProfileScreenName";
import { ProfileScreen } from "@screens/AppNavigator/Screens/profile/Profile.Screen";

export interface ProfileParamsList {
    [key: string]: undefined | object;
}

const Profile = createStackNavigator<ProfileParamsList>();

export const ProfileNavigator: React.FC = () => {

    return (
        <Profile.Navigator
            initialRouteName={ProfileScreenName.PROFILE_HOME}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Profile.Screen
                component={ProfileScreen}
                name={ProfileScreenName.PROFILE_HOME}
                options={{
                    headerShown: false,
                }}
            />

            {/* <Profile.Screen */}
            {/*     component={Addres} */}
            {/*     name={ProfileScreenName.ADD_ADDRESS_BOOK} */}
            {/*     options={{ */}
            {/*         cardStyleInterpolator: fixTabNestedStackCardStyleInterpolator, */}
            {/*         presentation: 'modal', */}
            {/*         animationEnabled: true, */}
            {/*     }} */}
            {/* /> */}
        </Profile.Navigator>
    );
};
