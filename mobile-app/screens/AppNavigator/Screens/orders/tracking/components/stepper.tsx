import {View} from "react-native";
import {tailwind} from "@tailwind";
import React, {PropsWithChildren} from "react";
import {IconComponent} from "@components/commons/IconComponent";

export const Step: React.FC<PropsWithChildren<{bgColor: string}>> = ({  bgColor, children }) => (
    <View style={{ flexDirection: 'row', width: '100%' }}>
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',

            }}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: bgColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {children}
                </View>
            </View>
        </View>
    </View>
);

export const Stepper: React.FC = () => {
    return (
        <View style={tailwind('flex flex-row items-center')}>
            <Step
                bgColor="blue-100"
            >
                <IconComponent iconType="Feather" name="check-circle" size={25} />
            </Step>
            <Step
                bgColor="blue-100"
            >
                <IconComponent iconType="Feather" name="check-circle" size={25} />
            </Step>
            <Step
                bgColor="blue-100"
            >
                <IconComponent iconType="Feather" name="check-circle" size={25} />
            </Step>
        </View>
    )
}
