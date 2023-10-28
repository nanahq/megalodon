import {Component, ReactElement} from "react";
import {Logger} from '@api/logging.util'
import {View, Text, Image} from "react-native";
import ErrorImage from '@assets/app-config/error.jpg'
import {tailwind} from "@tailwind";

interface State {
    hasError: boolean
}

interface Props {
    children: ReactElement
}

function ErrorBoundaryComponent(): JSX.Element {
    return (
        <View style={tailwind('flex justify-center w-full items-center')}>
            <Image source={ErrorImage}  resizeMode='cover' style={{width: 400, height: 350}} />
            <View style={tailwind('px-5')}>
                <Text style={tailwind('font-bold text-3xl text-brand-blue-500 text-center')}>Something went wrong!!</Text>
                <Text style={tailwind('font-semilbold text-xl text-brand-blue-500 text-center mt-4')}>Please restart the app</Text>
            </View>
        </View>
    )
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {hasError:false}
    }

    static  getDerivedStateFromError (): State {
        return {hasError: true}
    }

    componentDidCatch(error: any, errorInfo: any): any {
        // You can also log the error to an error reporting service
        Logger.error(error);
        Logger.error(errorInfo);
    }

    render(): JSX.Element {
      return  this.state.hasError ? <ErrorBoundaryComponent /> :(this.props.children)
    }

}


export default ErrorBoundary
