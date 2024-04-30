import {StyleProp, View, ViewProps} from 'react-native'
import {GenericTextInput} from "@components/commons/inputs/TextInput";
import {useState} from "react";
import {getColor, tailwind} from "@tailwind";


export function SearchBar({testID, containerStyle}: {testID: string, containerStyle?: StyleProp<ViewProps> }): JSX.Element {
    const [searchString, setSearchString] = useState<string>('')


    return (
        <View style={[tailwind('flex w-full border-0.5 border-brand-blue-500 rounded-xl'), containerStyle]}>
            <GenericTextInput
                containerStyle={tailwind('justify-between px-2.5 py-1')}
                testID={testID}
                onChangeText={setSearchString}
                initialText={searchString}
                placeholder='Search food, vendors, or restaurants'
                placeHolderStyle={getColor('brand-blue-500')}
                style={tailwind('flex-1 w-4/5')}
          />
                {/* <IconButton */}
                {/*     style={tailwind('flex-none')} */}
                {/*     onPress={onSearchDone} */}
                {/*     testID={`${testID}-button`} */}
                {/*     iconSize={24} */}
                {/*     iconType='Feather' */}
                {/*     iconName='search' */}
                {/*     iconStyle={tailwind('text-brand-blue-500 font-medium')} */}
                {/* /> */}

        </View>
    )
}
